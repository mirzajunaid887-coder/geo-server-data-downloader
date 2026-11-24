/*
 * Disk worker for big exports. Data is written to the browser's private file system (OPFS) instead of
 * being held in memory, so a layer with millions of features needs no more RAM than a small one.
 * Dedicated worker + synchronous access handles = works in Chrome, Edge, Firefox and Safari.
 * Messages in:  { id, op, ...args }      Messages out: { id, ok, result | error }
 */
var jobDir = null;
var handles = {};

async function openHandle(name, create) {
  if (handles[name]) return handles[name];
  var fh = await jobDir.getFileHandle(name, { create: create !== false });
  handles[name] = await fh.createSyncAccessHandle();
  return handles[name];
}

async function dropOldJobs(root) {
  // Remove leftovers of earlier exports (older than 2 hours) so temporary files never pile up.
  try {
    var base = await root.getDirectoryHandle('gdd-export', { create: true });
    var names = [];
    for await (var entry of base.entries()) names.push(entry[0]);
    for (var i = 0; i < names.length; i++) {
      var m = /^job-(\d+)-/.exec(names[i]);
      if (m && Date.now() - Number(m[1]) > 2 * 3600 * 1000) {
        try { await base.removeEntry(names[i], { recursive: true }); } catch (e) { /* in use */ }
      }
    }
    return base;
  } catch (e) { throw e; }
}

self.onmessage = async function (e) {
  var m = e.data;
  try {
    var result = null;
    var transfer = [];
    if (m.op === 'init') {
      var root = await navigator.storage.getDirectory();
      var base = await dropOldJobs(root);
      var job = 'job-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      jobDir = await base.getDirectoryHandle(job, { create: true });
      result = job;
    } else if (m.op === 'write') {
      var h = await openHandle(m.name, true);
      var n = h.write(m.buf, { at: m.at });
      result = n;
    } else if (m.op === 'read') {
      var hr = await openHandle(m.name, false);
      var size = hr.getSize();
      var len = Math.max(0, Math.min(m.len, size - m.at));
      var out = new Uint8Array(len);
      if (len) hr.read(out, { at: m.at });
      result = out.buffer;
      transfer = [out.buffer];
    } else if (m.op === 'size') {
      result = (await openHandle(m.name, false)).getSize();
    } else if (m.op === 'close') {
      if (handles[m.name]) { handles[m.name].flush(); handles[m.name].close(); delete handles[m.name]; }
      result = true;
    } else if (m.op === 'drop') {
      // delete this whole job (used when an export fails or is cancelled)
      Object.keys(handles).forEach(function (k) { try { handles[k].close(); } catch (e0) { /* ignore */ } delete handles[k]; });
      var rootD = await navigator.storage.getDirectory();
      var baseD = await rootD.getDirectoryHandle('gdd-export', { create: true });
      try { await baseD.removeEntry(m.job, { recursive: true }); } catch (e4) { /* already gone */ }
      result = true;
    } else if (m.op === 'remove') {
      if (handles[m.name]) { try { handles[m.name].close(); } catch (e2) { /* ignore */ } delete handles[m.name]; }
      try { await jobDir.removeEntry(m.name); } catch (e3) { /* already gone */ }
      result = true;
    } else {
      throw new Error('Unknown storage operation: ' + m.op);
    }
    self.postMessage({ id: m.id, ok: true, result: result }, transfer);
  } catch (err) {
    var name = err && err.name ? err.name + ': ' : '';
    self.postMessage({ id: m.id, ok: false, error: name + (err && err.message ? err.message : String(err)) });
  }
};
