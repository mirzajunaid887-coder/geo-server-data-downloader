import React, { useState, useRef } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2, Download, ShieldCheck, Zap, Info } from 'lucide-react';
import JSZip from 'jszip';
import { Link } from 'react-router-dom';
import { SEO, buildFaqSchema } from '../components/SEO';
import { articleStyle, h1Style, sectionStyle, h2Style, ulStyle, linkStyle } from './Privacy';

/* ============================================================
   20 SUPPORTED FORMATS
   ============================================================ */
const FORMAT_CONFIG: Record<
  string,
  { driver: string; ext: string; mime: string; isZip: boolean; options?: string[]; forceWGS84?: boolean }
> = {
  // --- Standard Web Formats ---
  geojson: { driver: 'GeoJSON', ext: 'geojson', mime: 'application/geo+json', isZip: false },
  topojson: { driver: 'TopoJSON', ext: 'topojson', mime: 'application/json', isZip: false },
  geojsonl: { driver: 'GeoJSONSeq', ext: 'geojsonl', mime: 'application/geo+json-seq', isZip: false },
  fgb: { driver: 'FlatGeobuf', ext: 'fgb', mime: 'application/octet-stream', isZip: false },
  kml: { driver: 'KML', ext: 'kml', mime: 'application/vnd.google-earth.kml+xml', isZip: false, forceWGS84: true },
  gml: { driver: 'GML', ext: 'gml', mime: 'application/gml+xml', isZip: false },
  rss: { driver: 'GeoRSS', ext: 'rss', mime: 'application/rss+xml', isZip: false, forceWGS84: true },

  // --- Desktop GIS & Database Formats ---
  shp: { driver: 'ESRI Shapefile', ext: 'zip', mime: 'application/zip', isZip: true },
  gpkg: { driver: 'GPKG', ext: 'gpkg', mime: 'application/geopackage+sqlite3', isZip: false },
  sqlite: { driver: 'SQLite', ext: 'sqlite', mime: 'application/x-sqlite3', isZip: false },
  tab: { driver: 'MapInfo File', ext: 'zip', mime: 'application/zip', isZip: true },
  mif: { driver: 'MapInfo File', ext: 'mif', mime: 'application/octet-stream', isZip: false, options: ['-lco', 'FORMAT=MIF'] },
  dgn: { driver: 'DGN', ext: 'dgn', mime: 'application/octet-stream', isZip: false },

  // --- Engineering & Mapping Formats ---
  gpx: { driver: 'GPX', ext: 'gpx', mime: 'application/gpx+xml', isZip: false, forceWGS84: true },
  dxf: { driver: 'DXF', ext: 'dxf', mime: 'image/vnd.dxf', isZip: false },
  jml: { driver: 'JML', ext: 'jml', mime: 'application/vnd.google-earth.kml+xml', isZip: false },
  gmt: { driver: 'GMT', ext: 'gmt', mime: 'text/plain', isZip: false },
  bna: { driver: 'BNA', ext: 'bna', mime: 'text/plain', isZip: false },

  // --- Tabular Format ---
  csv: { driver: 'CSV', ext: 'csv', mime: 'text/csv', isZip: false, options: ['-lco', 'GEOMETRY=AS_WKT'] },
};

export const GISConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('shp');
  const [status, setStatus] = useState<'idle' | 'loading' | 'converting' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
      setErrorMessage('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
      setErrorMessage('');
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus('loading');
    setErrorMessage('');
    setDownloadUrl(null);

    try {
      let filesToProcess: File[] = [];

      if (file.name.toLowerCase().endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        const extractedFiles: File[] = [];

        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
          if (!zipEntry.dir && !relativePath.includes('__MACOSX') && !relativePath.endsWith('.DS_Store')) {
            const fileName = relativePath.split('/').pop() || relativePath;
            const blob = await zipEntry.async('blob');
            extractedFiles.push(
              new File([blob], fileName, { type: 'application/octet-stream' })
            );
          }
        }
        filesToProcess = extractedFiles;
      } else {
        filesToProcess = [file];
      }

      if (filesToProcess.length === 0) {
        throw new Error('The uploaded zip file appears to be empty.');
      }

      const gdalModule = await import('gdal3.js');
      const initGdal = gdalModule.default || gdalModule;
      const gdal = await (initGdal as any)({
        path: 'https://cdn.jsdelivr.net/npm/gdal3.js@2.8.1/dist/package',
        useWorker: false,
      });

      setStatus('converting');

      const openResult = await gdal.open(filesToProcess);
      if (!openResult || !openResult.datasets || openResult.datasets.length === 0) {
        throw new Error('GDAL could not read this file. Please ensure it is a valid GIS format.');
      }
      const dataset = openResult.datasets[0];

      const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const config = FORMAT_CONFIG[targetFormat] || FORMAT_CONFIG['geojson'];

      // Build base options
      const options = ['-f', config.driver];
      
      // Isolate only the spatial layer
      const spatialLayerName = dataset.layers?.[0]?.name;
      if (spatialLayerName) {
        options.push('-sql', `SELECT * FROM "${spatialLayerName}"`);
      }

      // Force output layer name
      options.push('-nln', safeName);

      // Add format-specific options
      if (config.options) {
        options.push(...config.options);
      }
      
      // Force WGS84 for formats that strictly require it (KML, GPX, GeoRSS)
      if (config.forceWGS84) {
        options.push('-t_srs', 'EPSG:4326');
      }

      const outFileName = config.isZip ? safeName : `${safeName}.${config.ext}`;

      // Run the conversion
      await gdal.ogr2ogr(dataset, options, outFileName);

      // Retrieve generated files
      const outputFiles = await gdal.getOutputFiles();

      let blob: Blob;

      if (config.isZip) {
        const zip = new JSZip();
        let foundFiles = false;
        
        for (const fileInfo of outputFiles) {
          const fileName = fileInfo.path.split('/').pop();
          if (fileName) {
            const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            // Check for Shapefile components (.shp, .shx, .dbf, .prj, .cpg)
            // OR MapInfo TAB components (.tab, .dat, .map, .id)
            if (['.shp', '.shx', '.dbf', '.prj', '.cpg', '.tab', '.dat', '.map', '.id'].includes(fileExt)) {
              const fileBytes = await gdal.getFileBytes(fileInfo.path);
              zip.file(fileName, fileBytes);
              foundFiles = true;
            }
          }
        }
        
        if (!foundFiles) {
          throw new Error(`Conversion failed. GDAL could not produce the required components for ${config.driver}.`);
        }
        blob = await zip.generateAsync({ type: 'blob' });
        
      } else {
        const targetFile = outputFiles.find((f: any) => f.path.endsWith(`.${config.ext}`));
        
        if (!targetFile) {
          throw new Error(`Conversion failed. GDAL could not produce the ${config.ext.toUpperCase()} file.`);
        }
        
        const fileBytes = await gdal.getFileBytes(targetFile.path);
        blob = new Blob([fileBytes], { type: config.mime });
      }

      try { await gdal.close(dataset); } catch (e) {}

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFileName(`${safeName}.${config.ext}`);
      setStatus('done');

    } catch (err: any) {
      console.error('Conversion error details:', err);
      
      let errorText = '';
      if (Array.isArray(err) && err.length > 0) {
        errorText = err.map((e: any) => String(e)).join('\n');
      } else if (err instanceof Error) {
        errorText = err.message;
      } else if (typeof err === 'string') {
        errorText = err;
      } else if (err && typeof err === 'object') {
        errorText = err.message || JSON.stringify(err);
      }

      if (errorText.includes('.shx') || errorText.includes('.tab')) {
        setErrorMessage('The uploaded file is missing its required index or companion files. Please ensure your .zip contains all necessary components.');
      } else if (errorText.includes('Unable to open datasource')) {
        setErrorMessage('Could not open the uploaded file. Please ensure it is a valid, uncorrupted GIS file.');
      } else {
        setErrorMessage(errorText || 'An unknown error occurred during conversion.');
      }
      
      setStatus('error');
    }
  };

  return (
    <>
      <SEO
        title="Free GIS Format Converter — 20+ Formats Supported"
        description="Instantly convert GIS files online. 100% free, client-side converter supporting Shapefile, GeoJSON, KML, GeoPackage, CSV, GPX, TopoJSON, FlatGeobuf, DXF, GML, and more."
        keywords="GIS converter, convert Shapefile to GeoJSON, GeoJSON to KML, KML to Shapefile, GIS file converter online, convert to GPX, convert to FlatGeobuf, convert to TopoJSON"
        path="/converter"
        structuredData={buildFaqSchema([
          {
            question: 'How do I convert a Shapefile to GeoJSON?',
            answer: 'Zip your Shapefile components (.shp, .shx, .dbf, .prj) together, upload the .zip file to our converter, select GeoJSON as the output format, and click Convert.'
          },
          {
            question: 'Is my data uploaded to a server?',
            answer: 'No. All processing is done entirely in your browser using WebAssembly (GDAL). Your data never leaves your computer.'
          },
          {
            question: 'Can I convert a Shapefile to GPX?',
            answer: 'Yes, simply upload your zipped Shapefile and select GPX from the output format dropdown.'
          }
        ])}
      />

      <div style={articleStyle}>
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ ...h1Style, marginBottom: '0.75rem' }}>GIS File Converter</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Upload your spatial data and convert it to another format instantly. 
            Processing happens entirely in your browser. Your data is never uploaded to a server.
          </p>
        </header>

        {/* Tool Card */}
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '0.5rem',
              padding: '2rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: file ? 'var(--accent-soft)' : 'var(--bg-hover)',
              transition: 'background-color 0.2s',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".geojson,.json,.kml,.kmz,.zip,.gpkg,.csv,.gpx,.fgb,.gml,.dxf,.geojsonl,.topojson,.sqlite,.tab,.mif,.dgn,.jml,.gmt,.bna,.rss"
            />
            
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <FileType style={{ width: '2.5rem', height: '2.5rem', color: 'var(--accent-color)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{file.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-muted)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Click or drag file to upload</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports 20+ GIS formats (.zip, .geojson, .kml, .gpkg, etc.)</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Convert To
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="form-input"
            >
              <optgroup label="Standard Web Formats">
                <option value="geojson">GeoJSON (.geojson)</option>
                <option value="topojson">TopoJSON (.topojson)</option>
                <option value="geojsonl">GeoJSON Sequence (.geojsonl)</option>
                <option value="fgb">FlatGeobuf (.fgb)</option>
                <option value="kml">Google Earth KML (.kml)</option>
                <option value="gml">Geography Markup Language (.gml)</option>
                <option value="rss">GeoRSS (.rss)</option>
              </optgroup>
              <optgroup label="Desktop GIS & Databases">
                <option value="shp">ESRI Shapefile (.zip)</option>
                <option value="gpkg">GeoPackage (.gpkg)</option>
                <option value="sqlite">SQLite / SpatiaLite (.sqlite)</option>
                <option value="tab">MapInfo TAB (.zip)</option>
                <option value="mif">MapInfo MIF (.mif)</option>
                <option value="dgn">MicroStation DGN (.dgn)</option>
              </optgroup>
              <optgroup label="Engineering & Specialized">
                <option value="gpx">GPS Exchange Format (.gpx)</option>
                <option value="dxf">AutoCAD DXF (.dxf)</option>
                <option value="jml">OpenJUMP JML (.jml)</option>
                <option value="gmt">Generic Mapping Tools (.gmt)</option>
                <option value="bna">Atlas BNA (.bna)</option>
              </optgroup>
              <optgroup label="Tabular Data">
                <option value="csv">CSV with WKT (.csv)</option>
              </optgroup>
            </select>
            
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <Info style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <span>
                <strong>Projection Note:</strong> Desktop and web formats will preserve your original coordinate system. Google Earth (KML), GPX, and GeoRSS will automatically reproject to WGS84.
              </span>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={!file || status === 'loading' || status === 'converting'}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
          >
            {status === 'loading' || status === 'converting' ? (
              <>
                <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                {status === 'loading' ? 'Loading converter engine...' : 'Converting data...'}
              </>
            ) : (
              'Convert File'
            )}
          </button>

          {status === 'error' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--danger-soft)', color: 'var(--danger-color)', borderRadius: '0.375rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {status === 'done' && downloadUrl && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--success-soft)', border: '1px solid var(--success-color)', borderRadius: '0.375rem', textAlign: 'center' }}>
              <CheckCircle style={{ width: '2rem', height: '2rem', color: 'var(--success-color)', margin: '0 auto 0.5rem auto' }} />
              <p style={{ fontWeight: 600, color: 'var(--success-color)', marginBottom: '1rem' }}>Conversion Complete!</p>
              <a
                href={downloadUrl}
                download={outputFileName}
                className="btn-primary"
                style={{ display: 'inline-flex', backgroundColor: 'var(--success-color)' }}
              >
                <Download style={{ width: '1rem', height: '1rem' }} />
                Download {outputFileName}
              </a>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div style={{ maxWidth: '800px', margin: '4rem auto 0 auto' }}>
          <section style={sectionStyle}>
            <h2 style={h2Style}>How to Convert GIS Files Online</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              Our GIS converter makes it incredibly easy to transform spatial data between different formats. Whether you need to convert a Shapefile to GeoJSON for a web application, or a KML file to a Shapefile for desktop GIS software, this tool handles it all instantly.
            </p>
            <ol style={{ ...ulStyle, paddingLeft: '1.5rem', fontSize: '0.95rem' }}>
              <li>Select your source file. If uploading a Shapefile or MapInfo TAB, make sure it is zipped (.zip) and contains all necessary companion files.</li>
              <li>Choose your desired output format from the dropdown menu.</li>
              <li>Click <strong>Convert File</strong>. Our engine will parse the geometry and attributes and build your new file in seconds.</li>
            </ol>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Supported Formats</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              We support over 20 vector formats, powered by the industry-standard GDAL library:
            </p>
            <ul style={ulStyle}>
              <li><strong>ESRI Shapefile</strong> — The universal standard for desktop GIS.</li>
              <li><strong>GeoJSON</strong> — The modern format for web mapping and APIs.</li>
              <li><strong>Google Earth KML</strong> — Perfect for viewing data in Google Earth.</li>
              <li><strong>GeoPackage (GPKG)</strong> — The modern SQLite-based container for QGIS and ArcGIS Pro.</li>
              <li><strong>CSV</strong> — Spreadsheet-ready data with a WKT geometry column.</li>
              <li><strong>GPX</strong> — The standard format for GPS devices and fitness trackers.</li>
              <li><strong>FlatGeobuf (FGB)</strong> — An extremely fast, binary format optimized for web streaming.</li>
              <li><strong>GML</strong> — The XML-based OGC standard for government data exchange.</li>
              <li><strong>DXF</strong> — A CAD format compatible with AutoCAD and drafting software.</li>
              <li><strong>TopoJSON</strong> — An extension of GeoJSON that encodes topology, reducing file size.</li>
              <li><strong>GeoJSON Sequence</strong> — Newline-delimited GeoJSON for processing massive datasets.</li>
              <li><strong>MapInfo TAB &amp; MIF</strong> — Legacy formats widely used in local government and utilities.</li>
              <li><strong>SQLite / SpatiaLite</strong> — Lightweight, file-based spatial databases.</li>
              <li><strong>MicroStation DGN</strong> — A CAD format common in engineering and infrastructure.</li>
              <li><strong>OpenJUMP JML</strong> — An open XML-based GIS format.</li>
              <li><strong>GMT</strong> — A format used for generating maps in Generic Mapping Tools.</li>
              <li><strong>BNA</strong> — Atlas Boundary format.</li>
              <li><strong>GeoRSS</strong> — A simple XML format for geospatial feeds.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Why Use a Client-Side Converter?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <ShieldCheck style={{ width: '1.5rem', height: '1.5rem', color: 'var(--success-color)', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)' }}>100% Private and Secure</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unlike other converters, your data is never uploaded to a server. Everything is processed locally in your browser using WebAssembly.</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Zap style={{ width: '1.5rem', height: '1.5rem', color: 'var(--accent-color)', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)' }}>Blazing Fast</strong>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No waiting for uploads or downloads to a server. Conversions happen instantly on your device.</span>
                </div>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>Related Tools &amp; Guides</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-main)' }}>
              Need to download data directly from an ArcGIS REST service? Use our <Link to="/download" style={linkStyle}>GIS Data Downloader</Link> to query and export FeatureServers directly. 
              <br /><br />
              Want to learn more about these formats? Read our guide on <Link to="/blog/geojson-vs-shapefile-vs-geopackage" style={linkStyle}>GeoJSON vs Shapefile vs GeoPackage</Link> to understand which format is best for your project.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default GISConverter;