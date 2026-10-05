import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { APP_CONFIG } from '../config/app';
import { articleStyle, h1Style, h2Style, sectionStyle, ulStyle, linkStyle } from './Privacy';

export const About: React.FC = () => {
  const siteName = APP_CONFIG.APP_NAME;
  const contactEmail = 'gisgynix@gmail.com';

  return (
    <>
      <SEO
        title="About the Developer and the Project"
        description={`Learn about ${siteName}, a free client-side GIS data export tool created by Muhammad Junaid Baig, and the mission behind it.`}
        keywords="about GIS downloader, Muhammad Junaid Baig, client-side GIS tool, free geospatial data export"
        path="/about"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          mainEntity: {
            '@type': 'Person',
            name: 'Muhammad Junaid Baig',
            jobTitle: 'Geospatial Developer',
            email: contactEmail,
            url: 'https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/',
            knowsAbout: [
              'Geographic Information Systems (GIS)',
              'ArcGIS REST Services',
              'Web Feature Service (WFS)',
              'Spatial Data Conversion',
              'GeoJSON, Shapefile, KML, GeoPackage',
            ],
          },
        }}
      />

      <article style={articleStyle}>
        <h1 style={h1Style}>About {siteName}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Built by a GIS developer, for GIS professionals, researchers, and
          anyone who works with spatial data.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>The Story</h2>
          <p>
            {siteName} was built out of a very practical frustration: getting
            data out of ArcGIS REST services and other spatial web services
            is unnecessarily painful. You often need desktop software (ArcGIS
            Pro, QGIS), a working knowledge of GDAL command-line tools, or a
            paid third-party service just to turn a FeatureServer URL into a
            usable Shapefile or GeoJSON file.
          </p>
          <p>
            I wanted a tool that:
          </p>
          <ul style={ulStyle}>
            <li>Runs entirely in the browser — no installs, no signup, no server uploads.</li>
            <li>Supports every common spatial format (Shapefile, GeoJSON, KML, GeoPackage, CSV, GPX).</li>
            <li>Works equally well for ArcGIS REST, WFS, and ArcGIS Online layers.</li>
            <li>Is genuinely free, with no arbitrary feature limits or paywalls.</li>
          </ul>
          <p>
            That's exactly what {siteName} does. It's the tool I wished
            existed when I first started working with GIS data.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>About the Developer</h2>
          <p>
            I'm <strong>Muhammad Junaid Baig</strong>, a geospatial developer
            with hands-on experience building web mapping applications,
            working with ArcGIS Enterprise and ArcGIS Online, and processing
            vector spatial datasets at scale.
          </p>
          <p>
            Over the years I've worked with a wide range of spatial data
            sources — municipal parcel data, zoning districts, utility
            networks, environmental layers, and open geospatial data
            portals. {siteName} is a distillation of the techniques I use
            daily.
          </p>
          <p>
            If you'd like to see my professional background, you can find me
            on{' '}
            <a
              href="https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              LinkedIn
            </a>
            . For freelance work, I'm available on{' '}
            <a
              href="https://www.fiverr.com/gisgynix"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Fiverr
            </a>{' '}
            and{' '}
            <a
              href="https://www.upwork.com/freelancers/~014c5dfcb05a8b2acb"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Upwork
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>What the Tool Does</h2>
          <p>{siteName} provides two main workflows:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Direct URL loading:</strong> Paste any ArcGIS REST
              FeatureServer, MapServer, or WFS endpoint. The tool reads the
              service metadata, lists the sublayers, and lets you preview
              them on an interactive map.
            </li>
            <li>
              <strong>ArcGIS Online discovery:</strong> Search thousands of
              public feature services and open data layers hosted on ArcGIS
              Online without needing a URL in advance.
            </li>
          </ul>
          <p>
            Once a layer is loaded, you can view its attribute table, zoom
            to the extent, and export the full dataset in one of several
            spatial formats.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Supported Formats</h2>
          <ul style={ulStyle}>
            <li><strong>Shapefile (.zip)</strong> — the classic Esri vector format, packaged with all its sidecar files.</li>
            <li><strong>GeoJSON (.geojson)</strong> — the modern open standard for web and GIS interchange.</li>
            <li><strong>KML (.kml)</strong> — for viewing in Google Earth and other KML-compatible tools.</li>
            <li><strong>GeoPackage (.gpkg)</strong> — the modern open SQLite-based container format.</li>
            <li><strong>CSV (.csv)</strong> — attribute data with an optional WKT geometry column.</li>
            <li><strong>GPX (.gpx)</strong> — for GPS devices and route/track data.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Privacy-First Design</h2>
          <p>
            Every layer you load, every query, and every export runs
            entirely inside your browser using WebAssembly and JavaScript.
            Nothing — no URLs, no data, no exported files — is ever sent to
            a server we control. The only network requests are the ones your
            browser makes directly to the ArcGIS services you choose.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Technology</h2>
          <p>
            The site is built with <strong>React</strong>, <strong>Vite</strong>,{' '}
            <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>,{' '}
            <strong>ArcGIS Maps SDK for JavaScript</strong>, and{' '}
            <strong>gdal3.js</strong> (a WebAssembly port of GDAL). It's
            hosted as a static site, which keeps it fast, cheap to run, and
            easy to audit.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Get in Touch</h2>
          <p>
            Have a question, feature request, or bug report? I'd love to hear
            from you. The best way to reach me is by email at{' '}
            <a href={`mailto:${contactEmail}`} style={linkStyle}>
              {contactEmail}
            </a>{' '}
            or through the{' '}
            <Link to="/contact" style={linkStyle}>
              Contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  );
};

export default About;