import React from 'react';
import { Link } from 'react-router-dom';
import { SEO, buildFaqSchema } from '../components/SEO';
import {
  articleStyle,
  h1Style,
  h2Style,
  sectionStyle,
  ulStyle,
  linkStyle,
} from './Privacy';

export const Documentation: React.FC = () => {
  return (
    <>
      <SEO
        title="Documentation and User Guide"
        description="Complete guide to using Geo Server Data Downloader — load ArcGIS REST services, WFS endpoints, and ArcGIS Online datasets and export them as Shapefile, GeoJSON, KML, GeoPackage, or CSV."
        keywords="ArcGIS download guide, WFS tutorial, GIS export documentation, convert FeatureServer to Shapefile, download ArcGIS layer"
        path="/documentation"
        structuredData={buildFaqSchema([
          {
            question: 'How do I download an ArcGIS REST service as a Shapefile?',
            answer:
              'Paste your FeatureServer URL into the Downloader, click Add to load the layer, then use the Bulk Export button and choose the ESRI Shapefile option. The result downloads as a .zip archive.',
          },
          {
            question: 'Can I convert GeoJSON to KML with this tool?',
            answer:
              'Yes. Load any ArcGIS layer or service and select KML as your export format in the Bulk Export dialog. The tool converts the data to KML entirely in your browser.',
          },
          {
            question: 'Does the tool work with WFS services?',
            answer:
              'The tool supports ArcGIS REST FeatureServer, MapServer, and ArcGIS Online services. WFS support is planned; for now the primary integration is with ArcGIS REST endpoints.',
          },
          {
            question: 'Is my data uploaded to a server?',
            answer:
              'No. All processing happens in your browser using WebAssembly. Nothing is uploaded to any server we control.',
          },
        ])}
      />

      <article style={articleStyle}>
        <h1 style={h1Style}>Documentation &amp; User Guide</h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          Everything you need to know to load, inspect, and export spatial
          data with Geo Server Data Downloader.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Getting Started</h2>
          <p>
            Geo Server Data Downloader is a free, browser-based tool for
            extracting vector features from ArcGIS REST services, ArcGIS
            Online items, and other spatial web services. There's no install
            and no signup — just open the{' '}
            <Link to="/download" style={linkStyle}>
              Downloader
            </Link>{' '}
            and paste a URL.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Workflow 1: Loading a Service by URL</h2>
          <p>
            This is the fastest way to get started if you already know the
            URL of an ArcGIS REST service.
          </p>
          <ol style={{ ...ulStyle, paddingLeft: '1.4rem' }}>
            <li>
              Open the{' '}
              <Link to="/download" style={linkStyle}>
                Downloader
              </Link>{' '}
              page.
            </li>
            <li>
              Make sure the <strong>URL / Endpoint</strong> tab is selected.
            </li>
            <li>
              Paste a service URL. This can be:
              <ul style={{ ...ulStyle, marginTop: '0.4rem' }}>
                <li>
                  A FeatureServer root (e.g.,{' '}
                  <code>https://services.arcgis.com/.../FeatureServer</code>)
                </li>
                <li>
                  A specific layer (e.g., <code>.../FeatureServer/0</code>)
                </li>
                <li>A MapServer root or layer</li>
                <li>
                  An ArcGIS Online item URL (e.g.,{' '}
                  <code>https://www.arcgis.com/home/item.html?id=...</code>)
                </li>
              </ul>
            </li>
            <li>
              Click <strong>Add Layer</strong>.
            </li>
            <li>
              If the service contains multiple sublayers, you'll see a
              selection dialog. Choose the ones you want and click{' '}
              <strong>Add Selected</strong>.
            </li>
            <li>
              Each layer is added to the map and to the{' '}
              <strong>Layers</strong> panel.
            </li>
          </ol>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Workflow 2: Discovering ArcGIS Online Data</h2>
          <p>
            If you don't have a URL, use the{' '}
            <Link to="/discover" style={linkStyle}>
              Discover AGOL
            </Link>{' '}
            page to search thousands of public datasets hosted on ArcGIS
            Online.
          </p>
          <ol style={{ ...ulStyle, paddingLeft: '1.4rem' }}>
            <li>
              Enter a keyword like <em>parcels</em>, <em>zoning</em>,{' '}
              <em>roads</em>, or a place name.
            </li>
            <li>
              Click <strong>Search</strong>.
            </li>
            <li>
              Browse the results. Each card shows the dataset title, type,
              description, and available actions.
            </li>
            <li>
              Click <strong>Add to Map</strong> to automatically load the
              dataset in the Downloader.
            </li>
          </ol>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Using the Interactive Map</h2>
          <p>Every layer you load appears on the map. You can:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Pan and zoom</strong> with mouse drag or touch gestures.
            </li>
            <li>
              <strong>Search addresses</strong> or paste coordinates in{' '}
              <code>lat, lon</code> format using the search box in the
              top-right corner.
            </li>
            <li>
              <strong>Click any feature</strong> to view its attributes in a
              popup and highlight it on the map.
            </li>
            <li>
              <strong>Toggle layer visibility</strong> using the checkbox in
              the Layers panel.
            </li>
            <li>
              <strong>Zoom to a layer's extent</strong> via the ⋮ menu →{' '}
              <em>Zoom to Layer</em>.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Attribute Tables</h2>
          <p>
            Click on the layers ⋮ menu and select{' '}
            <strong>📊 Attribute Table</strong> to open the Esri FeatureTable
            widget. It displays every field, correctly formatted — including
            dates, numeric types, and coded value domains.
          </p>
          <p>
            The table supports multi-column sorting, row selection, zooming
            to a selected feature, and refreshing data directly from the
            service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Exporting Data</h2>
          <p>
            You can export a single layer or several layers at once. All
            exports happen in your browser.
          </p>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '1rem',
              marginBottom: '0.4rem',
            }}
          >
            Single Layer Export
          </h3>
          <p>
            Click the green <strong>Export</strong> button next to any layer.
            This downloads a GeoJSON file containing every feature in the
            layer.
          </p>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '1rem',
              marginBottom: '0.4rem',
            }}
          >
            Bulk Export
          </h3>
          <p>
            Click <strong>Bulk Export</strong> at the top of the Layers
            panel. Select the layers and choose a format:
          </p>
          <ul style={ulStyle}>
            <li>
              <strong>GeoPackage (.gpkg)</strong> — multi-layer SQLite
              container, best for QGIS and ArcGIS Pro.
            </li>
            <li>
              <strong>Shapefile (.zip)</strong> — one Shapefile per layer,
              all zipped together.
            </li>
            <li>
              <strong>GeoJSON (.geojson)</strong> — one file per layer.
            </li>
            <li>
              <strong>KML (.kml)</strong> — for Google Earth and compatible
              viewers.
            </li>
            <li>
              <strong>CSV (.csv)</strong> — attribute data, with a WKT
              geometry column appended.
            </li>
            <li>
              <strong>GPX (.gpx)</strong> — for GPS devices and outdoor apps.
            </li>
          </ul>
          <p>
            Bulk exports run inside a popup window so you can keep using the
            map while your files are being generated.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Understanding ArcGIS REST URLs</h2>
          <p>An ArcGIS REST FeatureServer URL typically looks like:</p>
          <pre
            style={{
              backgroundColor: 'var(--bg-hover)',
              padding: '0.75rem 1rem',
              borderRadius: '0.4rem',
              fontSize: '0.8rem',
              overflowX: 'auto',
              border: '1px solid var(--border-color)',
            }}
          >
            {'https://services.arcgis.com/{orgId}/arcgis/rest/services/{serviceName}/FeatureServer/{layerId}'}
          </pre>
          <p>
            The <code>/FeatureServer</code> part indicates the service type.
            The <code>{'/{layerId}'}</code> at the end identifies a specific
            layer within the service. If you omit the layer ID, the tool will
            show you a list of sublayers to choose from.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Troubleshooting</h2>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '1rem',
              marginBottom: '0.4rem',
            }}
          >
            "Token Required" Error
          </h3>
          <p>
            The service you're trying to load is secured. You need a valid
            ArcGIS token from the service owner. Public services work without
            a token.
          </p>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '1rem',
              marginBottom: '0.4rem',
            }}
          >
            Blank Map or No Features
          </h3>
          <p>
            Check that the layer has features in its extent, and that
            visibility is enabled. Some services only return features when
            zoomed in past a certain scale.
          </p>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginTop: '1rem',
              marginBottom: '0.4rem',
            }}
          >
            Export Fails or Times Out
          </h3>
          <p>
            Very large layers (over ~50,000 features) may take a while to
            process. Try exporting in smaller batches, or use a wired
            connection. All processing is done locally, so performance
            depends on your device.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Tips and Best Practices</h2>
          <ul style={ulStyle}>
            <li>
              Always verify that you have permission to download a dataset
              before doing so.
            </li>
            <li>
              Check the license attached to any ArcGIS Online item before
              redistributing.
            </li>
            <li>
              Use GeoPackage for multi-layer exports — it preserves field
              types better than Shapefile.
            </li>
            <li>For Google Earth, use KML. For web apps, use GeoJSON.</li>
            <li>
              If a service feels slow, try exporting fewer layers at a time.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Need More Help?</h2>
          <p>
            Check the{' '}
            <Link to="/contact" style={linkStyle}>
              Contact page
            </Link>{' '}
            to reach the developer directly.
          </p>
        </section>
      </article>
    </>
  );
};

export default Documentation;