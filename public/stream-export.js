/*
 * Streaming export engine for very large layers (hundreds of thousands to millions of features).
 *
 * Nothing is held in memory: every page of features is converted and appended to a file in the
 * browser's private file system (OPFS) through a worker (opfs-worker.js). Memory use stays flat
 * (a few pages in flight) whether the layer has 50,000 or 5,000,000 features.
 *
 *   paging  : sorted object IDs -> ranges "OID >= a AND OID <= b" of up to 1000 records (fast, tiny URLs),
 *             6 requests in parallel, retries, automatic splitting when a server returns less than asked.
 *   formats : Shapefile (.zip, written by hand: .shp .shx .dbf .prj .cpg, split into parts only if a
 *             part would pass the 2 GB shapefile limit), GeoJSON, CSV (geometry as WKT).
 *   zip     : written as a stream (ZIP64 when the archive passes 4 GB).
 *
 * Exposes window.GddStream.run(ctx). Used by export.html.
 */
(function (global) {
  'use strict';

  var enc = new TextEncoder();
  var BLOCK = 8 * 1024 * 1024;
  var CONCURRENCY = 6;
  var ZIP64_AT = 3.5e9;

  // ------------------------------------------------------------------ CRC32
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crcUpdate(crc, buf) {
    for (var i = 0, n = buf.length; i < n; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 255] ^ (crc >>> 8);
    return crc;
  }

  function friendlyError(text) {
    if (/QuotaExceeded|quota/i.test(text || '')) {
      return new Error('The browser ran out of storage space for this download. Free some disk space, or use Chrome or Edge, which allow much more storage. Layers this large need several gigabytes of temporary space.');
    }
    return new Error(text);
  }

  // ------------------------------------------------------------------ disk (OPFS worker)
  function Store() {
    var self = this;
    this.w = new Worker('/opfs-worker.js');
    this.seq = 0;
    this.pending = {};
    this.w.onmessage = function (e) {
      var m = e.data;
      var p = self.pending[m.id];
      if (!p) return;
      delete self.pending[m.id];
      if (m.ok) p.res(m.result); else p.rej(friendlyError(m.error));
    };
    this.w.onerror = function (e) {
      var err = new Error('The storage worker failed' + (e && e.message ? ': ' + e.message : '.'));
      Object.keys(self.pending).forEach(function (k) { self.pending[k].rej(err); });
      self.pending = {};
    };
  }
  Store.prototype.call = function (op, args, transfer) {
    var self = this;
    return new Promise(function (res, rej) {
      var id = ++self.seq;
      self.pending[id] = { res: res, rej: rej };
      self.w.postMessage(Object.assign({ id: id, op: op }, args || {}), transfer || []);
    });
  };

  function standalone(u8) {
    return u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength ? u8 : u8.slice();
  }

  function AppendFile(store, name) { this.store = store; this.name = name; this.pos = 0; }
  AppendFile.prototype.write = async function (u8) {
    if (!u8.length) return;
    u8 = standalone(u8);
    var n = u8.length;
    await this.store.call('write', { name: this.name, at: this.pos, buf: u8 }, [u8.buffer]);
    this.pos += n;
  };

  function SeqReader(store, name) {
    this.store = store; this.name = name; this.buf = new Uint8Array(0); this.p = 0; this.pos = 0; this.eof = false;
  }
  SeqReader.prototype.avail = function () { return this.buf.length - this.p; };
  SeqReader.prototype.fill = async function (min) {
    while (this.avail() < min && !this.eof) {
      var rest = this.buf.subarray(this.p);
      var want = Math.max(min - rest.length, BLOCK);
      var ab = await this.store.call('read', { name: this.name, at: this.pos, len: want });
      var nb = new Uint8Array(ab);
      this.pos += nb.length;
      if (nb.length < want) this.eof = true;
      var merged = new Uint8Array(rest.length + nb.length);
      merged.set(rest, 0);
      merged.set(nb, rest.length);
      this.buf = merged;
      this.p = 0;
    }
  };

  // Buffered output that flushes to an async sink in large pieces.
  function Out(sink, cap) { this.b = new Uint8Array(cap || 4 * 1024 * 1024); this.n = 0; this.sink = sink; }
  Out.prototype.room = async function (n) {
    if (this.n + n > this.b.length) {
      await this.flush();
      if (n > this.b.length) this.b = new Uint8Array(n);
    }
  };
  Out.prototype.flush = async function () {
    if (this.n) { var u = this.b.slice(0, this.n); this.n = 0; await this.sink(u); }
  };

  // Growable buffer for building one page.
  function Wbuf(cap) { this.b = new Uint8Array(cap || 65536); this.n = 0; }
  Wbuf.prototype.ensure = function (extra) {
    if (this.n + extra > this.b.length) {
      var nb = new Uint8Array(Math.max(this.b.length * 2, this.n + extra));
      nb.set(this.b.subarray(0, this.n));
      this.b = nb;
    }
  };
  Wbuf.prototype.take = function () { return this.b.slice(0, this.n); };

  // ------------------------------------------------------------------ ZIP (streamed)
  function dosStamp() {
    var d = new Date();
    return {
      time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
      date: (((d.getFullYear() - 1980) & 0x7f) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
    };
  }

  function ZipWriter(file, zip64) { this.file = file; this.zip64 = zip64; this.entries = []; this.cur = null; this.stamp = dosStamp(); }
  ZipWriter.prototype.begin = async function (name) {
    var nm = enc.encode(name);
    var h = new Uint8Array(30 + nm.length);
    var dv = new DataView(h.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, this.zip64 ? 45 : 20, true);
    dv.setUint16(6, 0x0808, true); // data descriptor follows + UTF-8 names
    dv.setUint16(10, this.stamp.time, true);
    dv.setUint16(12, this.stamp.date, true);
    dv.setUint16(26, nm.length, true);
    h.set(nm, 30);
    this.cur = { name: nm, offset: this.file.pos, crc: 0xffffffff, size: 0 };
    await this.file.write(h);
  };
  ZipWriter.prototype.write = async function (u8) {
    this.cur.crc = crcUpdate(this.cur.crc, u8);
    this.cur.size += u8.length;
    await this.file.write(u8);
  };
  ZipWriter.prototype.end = async function () {
    var c = this.cur;
    c.crc = (c.crc ^ 0xffffffff) >>> 0;
    var d = new Uint8Array(this.zip64 ? 24 : 16);
    var dv = new DataView(d.buffer);
    dv.setUint32(0, 0x08074b50, true);
    dv.setUint32(4, c.crc, true);
    if (this.zip64) { dv.setBigUint64(8, BigInt(c.size), true); dv.setBigUint64(16, BigInt(c.size), true); }
    else { dv.setUint32(8, c.size, true); dv.setUint32(12, c.size, true); }
    await this.file.write(d);
    this.entries.push(c);
    this.cur = null;
  };
  ZipWriter.prototype.finish = async function () {
    var self = this;
    var cdStart = this.file.pos;
    var parts = [];
    var total = 0;
    this.entries.forEach(function (e) {
      var extra = self.zip64 ? 28 : 0;
      var h = new Uint8Array(46 + e.name.length + extra);
      var dv = new DataView(h.buffer);
      dv.setUint32(0, 0x02014b50, true);
      dv.setUint16(4, 45, true);
      dv.setUint16(6, self.zip64 ? 45 : 20, true);
      dv.setUint16(8, 0x0808, true);
      dv.setUint16(12, self.stamp.time, true);
      dv.setUint16(14, self.stamp.date, true);
      dv.setUint32(16, e.crc, true);
      dv.setUint16(28, e.name.length, true);
      dv.setUint16(30, extra, true);
      if (self.zip64) {
        dv.setUint32(20, 0xffffffff, true);
        dv.setUint32(24, 0xffffffff, true);
        dv.setUint32(42, 0xffffffff, true);
      } else {
        dv.setUint32(20, e.size, true);
        dv.setUint32(24, e.size, true);
        dv.setUint32(42, e.offset, true);
      }
      h.set(e.name, 46);
      if (self.zip64) {
        var o = 46 + e.name.length;
        dv.setUint16(o, 0x0001, true);
        dv.setUint16(o + 2, 24, true);
        dv.setBigUint64(o + 4, BigInt(e.size), true);
        dv.setBigUint64(o + 12, BigInt(e.size), true);
        dv.setBigUint64(o + 20, BigInt(e.offset), true);
      }
      parts.push(h);
      total += h.length;
    });
    var cd = new Uint8Array(total);
    var p = 0;
    parts.forEach(function (h) { cd.set(h, p); p += h.length; });
    var cdLen = cd.length; // read before write(): the buffer is transferred to the worker
    await this.file.write(cd);
    var n = this.entries.length;
    if (this.zip64) {
      var z = new Uint8Array(56 + 20 + 22);
      var zv = new DataView(z.buffer);
      var eocd64At = this.file.pos;
      zv.setUint32(0, 0x06064b50, true);
      zv.setBigUint64(4, BigInt(44), true);
      zv.setUint16(12, 45, true);
      zv.setUint16(14, 45, true);
      zv.setBigUint64(24, BigInt(n), true);
      zv.setBigUint64(32, BigInt(n), true);
      zv.setBigUint64(40, BigInt(cdLen), true);
      zv.setBigUint64(48, BigInt(cdStart), true);
      zv.setUint32(56, 0x07064b50, true);
      zv.setBigUint64(64, BigInt(eocd64At), true);
      zv.setUint32(72, 1, true);
      zv.setUint32(76, 0x06054b50, true);
      zv.setUint16(84, 0xffff, true);
      zv.setUint16(86, 0xffff, true);
      zv.setUint32(88, 0xffffffff, true);
      zv.setUint32(92, 0xffffffff, true);
      await this.file.write(z);
    } else {
      var e = new Uint8Array(22);
      var ev = new DataView(e.buffer);
      ev.setUint32(0, 0x06054b50, true);
      ev.setUint16(8, n, true);
      ev.setUint16(10, n, true);
      ev.setUint32(12, cdLen, true);
      ev.setUint32(16, cdStart, true);
      await this.file.write(e);
    }
  };

  // ------------------------------------------------------------------ fields
  var KINDS = {
    esriFieldTypeOID: { kind: 'N', int: true },
    esriFieldTypeSmallInteger: { kind: 'N', int: true },
    esriFieldTypeInteger: { kind: 'N', int: true },
    esriFieldTypeBigInteger: { kind: 'N', int: true },
    esriFieldTypeDouble: { kind: 'N', int: false },
    esriFieldTypeSingle: { kind: 'N', int: false },
    esriFieldTypeDate: { kind: 'D' },
    esriFieldTypeDateOnly: { kind: 'D' },
    esriFieldTypeString: { kind: 'C' },
    esriFieldTypeGUID: { kind: 'C' },
    esriFieldTypeGlobalID: { kind: 'C' },
    esriFieldTypeXML: { kind: 'C' },
    esriFieldTypeTimestampOffset: { kind: 'C' },
  };

  function prepFields(meta) {
    var out = [];
    (meta || []).forEach(function (f) {
      var k = KINDS[f.type];
      if (!k) return;
      out.push({ name: f.name, alias: f.alias || '', kind: k.kind, int: !!k.int, maxLen: 0, maxInt: 0, maxDec: 0, trunc: 0 });
    });
    return out;
  }

  function dbfNames(fields) {
    var used = {};
    return fields.map(function (f) {
      var base = f.name.replace(/[^A-Za-z0-9_]/g, '_').slice(0, 10) || 'F';
      var n = base;
      var i = 1;
      while (used[n.toUpperCase()]) {
        var suf = '_' + i++;
        n = base.slice(0, 10 - suf.length) + suf;
      }
      used[n.toUpperCase()] = 1;
      return n;
    });
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function ymd(ms) {
    var d = new Date(ms);
    if (isNaN(d.getTime())) return '';
    return String(d.getUTCFullYear()).padStart(4, '0') + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate());
  }
  function realText(v) {
    if (Math.abs(v) >= 1e15) return String(Math.round(v));
    var s = v.toFixed(11);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }

  // ------------------------------------------------------------------ Shapefile
  var SHAPE_TYPES = { esriGeometryPolygon: 5, esriGeometryPolyline: 3, esriGeometryPoint: 1, esriGeometryMultipoint: 8 };

  // Writes one shape record body into wb. Returns { len, box } or null when there is nothing usable.
  function writeShape(wb, g, type, box) {
    var i, j, part, pts, np;
    if (type === 1) {
      if (g.x === undefined || g.x === null || g.y === undefined || g.y === null) return 0;
      wb.ensure(20);
      var dv1 = new DataView(wb.b.buffer, wb.n, 20);
      dv1.setInt32(0, 1, true); dv1.setFloat64(4, g.x, true); dv1.setFloat64(12, g.y, true);
      box[0] = box[2] = g.x; box[1] = box[3] = g.y;
      wb.n += 20;
      return 20;
    }
    if (type === 8) {
      pts = g.points || [];
      np = pts.length;
      if (!np) return 0;
      var size8 = 40 + 16 * np;
      wb.ensure(size8);
      var dv8 = new DataView(wb.b.buffer, wb.n, size8);
      dv8.setInt32(0, 8, true); dv8.setInt32(36, np, true);
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (i = 0; i < np; i++) {
        var px = pts[i][0], py = pts[i][1];
        dv8.setFloat64(40 + 16 * i, px, true); dv8.setFloat64(48 + 16 * i, py, true);
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
      dv8.setFloat64(4, x0, true); dv8.setFloat64(12, y0, true); dv8.setFloat64(20, x1, true); dv8.setFloat64(28, y1, true);
      box[0] = x0; box[1] = y0; box[2] = x1; box[3] = y1;
      wb.n += size8;
      return size8;
    }
    var poly = type === 5;
    var src = poly ? g.rings : g.paths;
    if (!src) return 0;
    var keep = [];
    var nPts = 0;
    for (i = 0; i < src.length; i++) {
      part = src[i];
      if (!part) continue;
      var closeIt = poly && part.length > 0 && (part[0][0] !== part[part.length - 1][0] || part[0][1] !== part[part.length - 1][1]);
      var cnt = part.length + (closeIt ? 1 : 0);
      if (cnt < (poly ? 4 : 2)) continue;
      keep.push({ pts: part, close: closeIt, cnt: cnt });
      nPts += cnt;
    }
    if (!keep.length) return 0;
    var size = 44 + 4 * keep.length + 16 * nPts;
    wb.ensure(size);
    var dv = new DataView(wb.b.buffer, wb.n, size);
    dv.setInt32(0, type, true);
    dv.setInt32(36, keep.length, true);
    dv.setInt32(40, nPts, true);
    var xa = Infinity, ya = Infinity, xb = -Infinity, yb = -Infinity;
    var idx = 0;
    var o = 44 + 4 * keep.length;
    for (i = 0; i < keep.length; i++) {
      dv.setInt32(44 + 4 * i, idx, true);
      part = keep[i];
      for (j = 0; j < part.cnt; j++) {
        var pt = j < part.pts.length ? part.pts[j] : part.pts[0];
        var x = pt[0], y = pt[1];
        dv.setFloat64(o, x, true); dv.setFloat64(o + 8, y, true);
        o += 16;
        if (x < xa) xa = x; if (x > xb) xb = x; if (y < ya) ya = y; if (y > yb) yb = y;
      }
      idx += part.cnt;
    }
    dv.setFloat64(4, xa, true); dv.setFloat64(12, ya, true); dv.setFloat64(20, xb, true); dv.setFloat64(28, yb, true);
    box[0] = xa; box[1] = ya; box[2] = xb; box[3] = yb;
    wb.n += size;
    return size;
  }

  function shpHeader(type, fileBytes, box) {
    var h = new Uint8Array(100);
    var dv = new DataView(h.buffer);
    dv.setInt32(0, 9994, false);
    dv.setInt32(24, fileBytes / 2, false);
    dv.setInt32(28, 1000, true);
    dv.setInt32(32, type, true);
    for (var i = 0; i < 4; i++) dv.setFloat64(36 + 8 * i, box[i], true);
    return h;
  }

  function shapefileFormat(ctx, store) {
    var type = SHAPE_TYPES[ctx.info.geometryType];
    if (!type) throw new Error('Shapefile export does not support this geometry type (' + (ctx.info.geometryType || 'unknown') + '). Choose GeoJSON or CSV.');
    var fields = prepFields(ctx.info.fields);
    if (!fields.length) throw new Error('The layer did not list any fields.');
    var N = ctx.ids.length;
    var glen = new Int32Array(N);
    var gbox = new Float64Array(4 * N);
    var count = 0;
    var skipped = 0;
    var geomFile = new AppendFile(store, 'geom.bin');
    var attrFile = new AppendFile(store, 'attr.bin');
    var written = 0;

    function encode(features) {
      var gw = new Wbuf(Math.max(65536, features.length * 400));
      var aw = new Wbuf(Math.max(65536, features.length * fields.length * 12));
      var lens = [];
      var boxes = [];
      var box = [0, 0, 0, 0];
      for (var fi = 0; fi < features.length; fi++) {
        var feat = features[fi];
        var len = feat.geometry ? writeShape(gw, feat.geometry, type, box) : 0;
        if (!len) { skipped++; continue; }
        lens.push(len);
        boxes.push(box[0], box[1], box[2], box[3]);
        var at = feat.attributes || {};
        for (var k = 0; k < fields.length; k++) {
          var f = fields[k];
          var v = at[f.name];
          aw.ensure(260);
          var pos = aw.n;
          if (v === null || v === undefined) { aw.b[pos] = 0; aw.n = pos + 1; continue; }
          var cellLen;
          if (f.kind === 'C') {
            var s = typeof v === 'string' ? v : String(v);
            var r = enc.encodeInto(s, aw.b.subarray(pos + 1, pos + 255));
            cellLen = r.written;
            if (r.read < s.length) f.trunc++;
            if (cellLen > f.maxLen) f.maxLen = cellLen;
          } else {
            var t;
            if (f.kind === 'D') t = typeof v === 'number' ? ymd(v) : (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10).replace(/-/g, '') : '');
            else {
              var num = typeof v === 'number' ? v : Number(v);
              t = isFinite(num) ? (f.int ? String(Math.trunc(num)) : realText(num)) : '';
              if (t) {
                var dot = t.indexOf('.');
                var il = dot < 0 ? t.length : dot;
                var dc = dot < 0 ? 0 : t.length - dot - 1;
                if (il > f.maxInt) f.maxInt = il;
                if (dc > f.maxDec) f.maxDec = dc;
              }
            }
            cellLen = t.length;
            for (var q = 0; q < cellLen; q++) aw.b[pos + 1 + q] = t.charCodeAt(q);
          }
          aw.b[pos] = cellLen;
          aw.n = pos + 1 + cellLen;
        }
      }
      return { geom: gw.take(), attr: aw.take(), lens: lens, boxes: boxes };
    }

    async function commit(p) {
      await geomFile.write(p.geom);
      await attrFile.write(p.attr);
      written += p.geom.length + p.attr.length;
      for (var i = 0; i < p.lens.length; i++) {
        glen[count] = p.lens[i];
        gbox[4 * count] = p.boxes[4 * i]; gbox[4 * count + 1] = p.boxes[4 * i + 1];
        gbox[4 * count + 2] = p.boxes[4 * i + 2]; gbox[4 * count + 3] = p.boxes[4 * i + 3];
        count++;
      }
    }

    async function finish() {
      var ui = ctx.ui;
      var R = count;
      if (R === 0) throw new Error('None of the downloaded features had usable geometry.');
      var nf = fields.length;
      var names = dbfNames(fields);
      var widths = fields.map(function (f) {
        if (f.kind === 'D') return 8;
        if (f.kind === 'N') return Math.max(1, f.maxInt + (f.maxDec > 0 ? f.maxDec + 1 : 0));
        return Math.max(1, f.maxLen);
      });
      var recLen = 1 + widths.reduce(function (a, b) { return a + b; }, 0);
      var dbfHead = 32 + 32 * nf + 1;
      var LIMIT = ctx.partBytes || 1.9e9;

      // split into parts only if a shapefile part would pass the 2 GB limit
      var parts = [];
      var start = 0;
      var shpB = 100;
      for (var i = 0; i < R; i++) {
        var add = 8 + glen[i];
        if (i > start && (shpB + add > LIMIT || dbfHead + (i - start + 1) * recLen + 1 > LIMIT)) {
          parts.push({ start: start, end: i, shpBytes: shpB });
          start = i;
          shpB = 100;
        }
        shpB += add;
      }
      parts.push({ start: start, end: R, shpBytes: shpB });
      parts.forEach(function (p) {
        var b = [Infinity, Infinity, -Infinity, -Infinity];
        for (var r = p.start; r < p.end; r++) {
          if (gbox[4 * r] < b[0]) b[0] = gbox[4 * r];
          if (gbox[4 * r + 1] < b[1]) b[1] = gbox[4 * r + 1];
          if (gbox[4 * r + 2] > b[2]) b[2] = gbox[4 * r + 2];
          if (gbox[4 * r + 3] > b[3]) b[3] = gbox[4 * r + 3];
        }
        p.box = b;
      });

      var prj = ctx.prjText ? enc.encode(ctx.prjText) : null;
      var cpg = enc.encode('UTF-8');
      var mapped = [];
      fields.forEach(function (f, k) { if (names[k] !== f.name) mapped.push(names[k] + ' = ' + f.name + (f.alias && f.alias !== f.name ? ' (' + f.alias + ')' : '')); });
      var mapTxt = mapped.length ? enc.encode('Shapefile field names are limited to 10 characters. Full names:\r\n' + mapped.join('\r\n') + '\r\n') : null;

      var predicted = 0;
      parts.forEach(function (p) {
        predicted += p.shpBytes + (100 + 8 * (p.end - p.start)) + (dbfHead + (p.end - p.start) * recLen + 1) + (prj ? prj.length : 0) + 5;
      });
      var zip64 = !!ctx.forceZip64 || predicted > ZIP64_AT;
      var zip = new ZipWriter(new AppendFile(store, 'export.zip'), zip64);
      var geom = new SeqReader(store, 'geom.bin');
      var attr = new SeqReader(store, 'attr.bin');
      var base = ctx.fileBase;
      var nbytes = function (u) { return zip.write(u); };

      for (var pi = 0; pi < parts.length; pi++) {
        var P = parts[pi];
        var n = P.end - P.start;
        var stem = parts.length > 1 ? base + '_part' + (pi + 1) : base;
        var label = parts.length > 1 ? ' (part ' + (pi + 1) + ' of ' + parts.length + ')' : '';

        // .shp
        ui.status('Building the shapefile' + label + ': geometry...');
        await zip.begin(stem + '.shp');
        var out = new Out(nbytes);
        await out.room(100);
        out.b.set(shpHeader(type, P.shpBytes, P.box), out.n); out.n += 100;
        for (var r = P.start; r < P.end; r++) {
          var len = glen[r];
          if (geom.avail() < len) await geom.fill(len);
          await out.room(8 + len);
          var hv = new DataView(out.b.buffer, out.n, 8);
          hv.setInt32(0, r - P.start + 1, false);
          hv.setInt32(4, len / 2, false);
          out.b.set(geom.buf.subarray(geom.p, geom.p + len), out.n + 8);
          geom.p += len;
          out.n += 8 + len;
          if (((r - P.start) & 0x3fff) === 0) ui.progress(0.86 + 0.14 * (pi + (r - P.start) / n * 0.3) / parts.length, null);
        }
        await out.flush();
        await zip.end();

        // .shx
        await zip.begin(stem + '.shx');
        out = new Out(nbytes);
        await out.room(100);
        out.b.set(shpHeader(type, 100 + 8 * n, P.box), out.n); out.n += 100;
        var words = 50;
        for (r = P.start; r < P.end; r++) {
          await out.room(8);
          var xv = new DataView(out.b.buffer, out.n, 8);
          xv.setInt32(0, words, false);
          xv.setInt32(4, glen[r] / 2, false);
          out.n += 8;
          words += (8 + glen[r]) / 2;
        }
        await out.flush();
        await zip.end();

        // .dbf
        ui.status('Building the shapefile' + label + ': attribute table...');
        await zip.begin(stem + '.dbf');
        out = new Out(nbytes);
        await out.room(dbfHead);
        var now = new Date();
        var dh = new DataView(out.b.buffer, out.n, dbfHead);
        out.b.fill(0, out.n, out.n + dbfHead);
        dh.setUint8(0, 3); dh.setUint8(1, now.getFullYear() - 1900); dh.setUint8(2, now.getMonth() + 1); dh.setUint8(3, now.getDate());
        dh.setUint32(4, n, true); dh.setUint16(8, dbfHead, true); dh.setUint16(10, recLen, true);
        for (var fk = 0; fk < nf; fk++) {
          var fo = 32 + 32 * fk;
          for (var ci = 0; ci < names[fk].length; ci++) out.b[out.n + fo + ci] = names[fk].charCodeAt(ci);
          out.b[out.n + fo + 11] = fields[fk].kind.charCodeAt(0);
          out.b[out.n + fo + 16] = widths[fk];
          out.b[out.n + fo + 17] = fields[fk].kind === 'N' ? fields[fk].maxDec : 0;
        }
        out.b[out.n + dbfHead - 1] = 0x0d;
        out.n += dbfHead;
        var need = nf * 256 + 16;
        for (r = P.start; r < P.end; r++) {
          if (attr.avail() < need && !attr.eof) await attr.fill(need);
          await out.room(recLen);
          var ob = out.b;
          var w = out.n;
          ob[w++] = 0x20;
          for (var k2 = 0; k2 < nf; k2++) {
            var fd = fields[k2];
            var wd = widths[k2];
            var l = attr.buf[attr.p++];
            if (fd.kind === 'C') {
              if (l) ob.set(attr.buf.subarray(attr.p, attr.p + l), w);
              if (wd > l) ob.fill(32, w + l, w + wd);
            } else if (fd.kind === 'D') {
              if (l === 8) ob.set(attr.buf.subarray(attr.p, attr.p + 8), w); else ob.fill(32, w, w + 8);
            } else if (l === 0) {
              ob.fill(32, w, w + wd);
            } else if (fd.maxDec === 0) {
              ob.fill(32, w, w + wd - l);
              ob.set(attr.buf.subarray(attr.p, attr.p + l), w + wd - l);
            } else {
              var txt = String.fromCharCode.apply(null, attr.buf.subarray(attr.p, attr.p + l));
              var fx = Number(txt).toFixed(fd.maxDec);
              if (fx.length > wd) fx = fx.slice(0, wd);
              ob.fill(32, w, w + wd - fx.length);
              for (var z = 0; z < fx.length; z++) ob[w + wd - fx.length + z] = fx.charCodeAt(z);
            }
            attr.p += l;
            w += wd;
          }
          out.n = w;
          if (((r - P.start) & 0x3fff) === 0) ui.progress(0.86 + 0.14 * (pi + 0.3 + (r - P.start) / n * 0.7) / parts.length, null);
        }
        await out.room(1);
        out.b[out.n++] = 0x1a;
        await out.flush();
        await zip.end();

        if (prj) { await zip.begin(stem + '.prj'); await zip.write(prj.slice()); await zip.end(); }
        await zip.begin(stem + '.cpg'); await zip.write(cpg.slice()); await zip.end();
      }
      if (mapTxt) { await zip.begin(base + '_field_names.txt'); await zip.write(mapTxt.slice()); await zip.end(); }
      await zip.finish();

      var trunc = fields.filter(function (f) { return f.trunc > 0; });
      if (trunc.length) ctx.ui.log('Some text values were longer than the 254 characters a shapefile allows and were shortened: ' + trunc.map(function (f) { return f.name; }).join(', '));
      if (skipped) ctx.ui.log(skipped.toLocaleString() + ' features without usable geometry were left out.');
      await store.call('remove', { name: 'geom.bin' });
      await store.call('remove', { name: 'attr.bin' });
      await store.call('close', { name: 'export.zip' });
      return { stored: 'export.zip', filename: base + '.zip', parts: parts.length, features: R, zip64: zip64 };
    }

    return { encode: encode, commit: commit, finish: finish, bytes: function () { return written; }, factor: 2.4 };
  }

  // ------------------------------------------------------------------ GeoJSON / CSV
  function crsMember(srs) {
    if (!srs || srs === 'EPSG:4326') return '';
    var m = /^(EPSG|ESRI):(\d+)$/.exec(srs);
    var name = m ? 'urn:ogc:def:crs:' + m[1] + '::' + m[2] : srs;
    return '"crs":' + JSON.stringify({ type: 'name', properties: { name: name } }) + ',\n';
  }

  function geojsonFormat(ctx, store) {
    var file = new AppendFile(store, 'out.geojson');
    var T = ctx.deps.Terraformer;
    var count = 0;
    var written = 0;
    var head = '{"type":"FeatureCollection","name":' + JSON.stringify(ctx.layerName) + ',\n' + (ctx.native ? crsMember(ctx.srs) : '') + '"features":[\n';
    function encode(features) {
      ctx.deps.applyDateFormatting(features, ctx.info.fieldTypes);
      var fc = T.arcgisToGeoJSON({ features: features, spatialReference: { wkid: 4326 } });
      return fc.features.map(function (f) { return JSON.stringify(f); }).join(',\n');
    }
    async function commit(text) {
      if (!text) return;
      var u = enc.encode((count === 0 ? head : ',\n') + text);
      count += 1;
      written += u.length;
      await file.write(u);
    }
    async function finish() {
      await file.write(enc.encode(count === 0 ? head + '\n]}\n' : '\n]}\n'));
      await store.call('close', { name: 'out.geojson' });
      return { stored: 'out.geojson', filename: ctx.fileBase + '.geojson', features: ctx.counted() };
    }
    return { encode: encode, commit: commit, finish: finish, bytes: function () { return written; }, factor: 1.2 };
  }

  function wktNum(n) { return String(n); }
  function wktPt(p) { return wktNum(p[0]) + ' ' + wktNum(p[1]); }
  function wktRing(c) { return c.map(wktPt).join(', '); }
  function toWkt(g) {
    if (!g) return '';
    var c = g.coordinates;
    switch (g.type) {
      case 'Point': return 'POINT (' + wktPt(c) + ')';
      case 'MultiPoint': return 'MULTIPOINT (' + c.map(function (p) { return '(' + wktPt(p) + ')'; }).join(', ') + ')';
      case 'LineString': return 'LINESTRING (' + wktRing(c) + ')';
      case 'MultiLineString': return 'MULTILINESTRING (' + c.map(function (l) { return '(' + wktRing(l) + ')'; }).join(', ') + ')';
      case 'Polygon': return 'POLYGON (' + c.map(function (r) { return '(' + wktRing(r) + ')'; }).join(', ') + ')';
      case 'MultiPolygon': return 'MULTIPOLYGON (' + c.map(function (pl) { return '(' + pl.map(function (r) { return '(' + wktRing(r) + ')'; }).join(', ') + ')'; }).join(', ') + ')';
      default: return '';
    }
  }
  function csvCell(v) {
    if (v === null || v === undefined) return '';
    var s = typeof v === 'string' ? v : String(v);
    return /[",\r\n]|^\s|\s$/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function csvFormat(ctx, store) {
    var file = new AppendFile(store, 'out.csv');
    var T = ctx.deps.Terraformer;
    var fields = (ctx.info.fields || []).filter(function (f) { return KINDS[f.type]; }).map(function (f) { return f.name; });
    var count = 0;
    var written = 0;
    function encode(features) {
      ctx.deps.applyDateFormatting(features, ctx.info.fieldTypes);
      var fc = T.arcgisToGeoJSON({ features: features, spatialReference: { wkid: 4326 } });
      if (!fc.features.length) return '';
      var rows = new Array(fc.features.length);
      for (var i = 0; i < fc.features.length; i++) {
        var gf = fc.features[i];
        var props = gf.properties || {};
        var cells = new Array(fields.length + 1);
        cells[0] = '"' + toWkt(gf.geometry) + '"';
        for (var k = 0; k < fields.length; k++) cells[k + 1] = csvCell(props[fields[k]]);
        rows[i] = cells.join(',');
      }
      return rows.join('\n') + '\n';
    }
    var header = '\ufeff' + ['WKT'].concat(fields.map(csvCell)).join(',') + '\n';
    async function commit(text) {
      if (!text) return;
      var u = enc.encode((count === 0 ? header : '') + text);
      count += 1;
      written += u.length;
      await file.write(u);
    }
    async function finish() {
      if (count === 0) await file.write(enc.encode(header));
      await store.call('close', { name: 'out.csv' });
      return { stored: 'out.csv', filename: ctx.fileBase + '.csv', features: ctx.counted() };
    }
    return { encode: encode, commit: commit, finish: finish, bytes: function () { return written; }, factor: 1.2 };
  }

  // ------------------------------------------------------------------ paging + driver
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function withRetry(fn, tries) {
    var last;
    for (var a = 0; a < tries; a++) {
      if (a > 0) await sleep(Math.min(20000, 1500 * Math.pow(2, a - 1)) + Math.random() * 500);
      try { return await fn(); } catch (e) { last = e; }
    }
    throw last;
  }

  async function fetchRange(ctx, lo, hi) {
    var ids = ctx.ids;
    var oid = ctx.info.oidField;
    var expected = hi - lo + 1;
    var base = { outFields: '*', returnGeometry: 'true' };
    if (ctx.outSR) base.outSR = ctx.outSR; else if (!ctx.native) base.outSR = '4326';
    var data;
    try {
      data = await ctx.deps.arcgisRequest(ctx.base + '/query', Object.assign({ where: oid + ' >= ' + ids[lo] + ' AND ' + oid + ' <= ' + ids[hi] }, base));
    } catch (e) {
      // some servers reject range filters: fall back to an explicit ID list for this page
      data = await ctx.deps.arcgisRequest(ctx.base + '/query', Object.assign({ objectIds: ids.slice(lo, hi + 1).join(',') }, base));
    }
    var feats = data.features || [];
    if (data.exceededTransferLimit && hi > lo && feats.length < expected) {
      var mid = lo + Math.floor((hi - lo) / 2);
      var a = await fetchRange(ctx, lo, mid);
      var b = await fetchRange(ctx, mid + 1, hi);
      return a.concat(b);
    }
    return feats;
  }

  function fmtDuration(sec) {
    if (!isFinite(sec) || sec < 0) return '';
    if (sec < 90) return Math.round(sec) + ' s';
    if (sec < 5400) return Math.round(sec / 60) + ' min';
    return (sec / 3600).toFixed(1) + ' h';
  }

  async function checkQuota(neededBytes, ui) {
    try {
      var e = await navigator.storage.estimate();
      var free = (e.quota || 0) - (e.usage || 0);
      if (e.quota && free < neededBytes) {
        throw new Error('Not enough free browser storage for this download. It needs about ' + (neededBytes / 1e9).toFixed(1) + ' GB and the browser allows ' + (Math.max(0, free) / 1e9).toFixed(1) + ' GB. Free some disk space, or use Chrome or Edge, which allow much more.');
      }
    } catch (err) {
      if (err && /Not enough free/.test(err.message)) throw err;
    }
  }

  async function run(ctx) {
    var ui = ctx.ui;
    var store;
    var lock = null;
    try {
      store = new Store();
      store.job = await store.call('init');
    } catch (e) {
      throw new Error('This browser blocked file storage for large downloads (private windows often do this). Open the page in a normal window, or use Chrome or Edge. (' + e.message + ')');
    }
    try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { /* optional */ }

    try {
      ctx.ids.sort(function (a, b) { return a - b; });
      var total = ctx.ids.length;
      var counted = 0;
      ctx.counted = function () { return counted; };
      var fmt = ctx.format === 'shp' ? shapefileFormat(ctx, store) : ctx.format === 'geojson' ? geojsonFormat(ctx, store) : csvFormat(ctx, store);

      var pageSize = Math.max(100, Math.min(ctx.maxRecordCount || 1000, 1000));
      var pages = [];
      for (var i = 0; i < total; i += pageSize) pages.push([i, Math.min(i + pageSize, total) - 1]);

      var next = 0;
      var fetched = 0;
      var failed = null;
      var checked = false;
      var checked10 = false;
      var t0 = Date.now();
      var chain = Promise.resolve();
      function serial(fn) {
        var p = chain.then(fn);
        chain = p.catch(function () { /* keep the chain alive; the error is thrown to the caller */ });
        return p;
      }

      async function worker() {
        while (!failed) {
          var idx = next++;
          if (idx >= pages.length) return;
          try {
            var range = pages[idx];
            var feats = await withRetry(function () { return fetchRange(ctx, range[0], range[1]); }, 5);
            feats = feats.filter(ctx.deps.hasValidGeometry);
            var payload = fmt.encode(feats);
            await serial(async function () {
              await fmt.commit(payload);
              counted += feats.length;
              fetched += range[1] - range[0] + 1;
              if (!checked && fmt.bytes() > 0) {
                checked = true;
                var perFeature = fmt.bytes() / Math.max(1, counted);
                await checkQuota(perFeature * total * fmt.factor, ui);
              }
              if (!checked10 && counted >= total * 0.1) {
                checked10 = true; // second, better estimate once 10% of the data has been seen
                await checkQuota(fmt.bytes() / Math.max(1, counted) * total * fmt.factor, ui);
              }
            });
            var sec = (Date.now() - t0) / 1000;
            var rate = fetched / Math.max(sec, 0.001);
            ui.progress(fetched / total * 0.85, 'Downloading ' + fetched.toLocaleString() + ' of ' + total.toLocaleString() + ' features' + (fetched < total && sec > 5 ? ' (about ' + fmtDuration((total - fetched) / rate) + ' left)' : ''));
          } catch (e) {
            failed = failed || e;
            throw e;
          }
        }
      }
      var workers = [];
      for (var w = 0; w < Math.min(CONCURRENCY, pages.length); w++) workers.push(worker());
      await Promise.all(workers);
      if (failed) throw failed;
      ui.log(counted.toLocaleString() + ' features downloaded in ' + fmtDuration((Date.now() - t0) / 1000) + '.');

      ui.progress(0.86, 'Finishing the file...');
      var result = await fmt.finish();

      // hand the finished file to the page (a File object stays on disk, it is not loaded into memory)
      var root = await navigator.storage.getDirectory();
      var dir = await root.getDirectoryHandle('gdd-export');
      var job = await dir.getDirectoryHandle(store.job);
      var fh = await job.getFileHandle(result.stored);
      var file = await fh.getFile();
      return Object.assign({ file: file }, result);
    } catch (err) {
      try { await store.call('drop', { job: store.job }); } catch (e) { /* ignore */ }
      throw err;
    } finally {
      try { if (lock) await lock.release(); } catch (e) { /* ignore */ }
      try { store.w.terminate(); } catch (e) { /* ignore */ }
    }
  }

  global.GddStream = { run: run, _toWkt: toWkt };
})(window);
