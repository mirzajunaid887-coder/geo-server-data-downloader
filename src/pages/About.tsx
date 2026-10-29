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
        description={`Learn about ${siteName}, a comprehensive client-side GIS platform for downloading, discovering, and converting spatial data, created by Muhammad Junaid Baig.`}
        keywords="about GIS downloader, Muhammad Junaid Baig, client-side GIS tool, free geospatial data download, GIS converter"
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
          Geo Server Data Downloader is a project I built to make working with GIS data simpler and more accessible. 
          As someone who works with geospatial data, I know how frustrating it can be to find a dataset, 
          download it from a web service, and get it into the format you actually need.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Why I Built It</h2>
          <p>
            Sometimes, a task as simple as downloading data from an ArcGIS REST service or converting GeoJSON to KML requires desktop software, 
            command-line tools, or a separate online service. 
            I wanted to make these everyday tasks easier, 
            so I started building a tool that brings them together in one place.
            My goal was to create a practical GIS tool that people could use without
            installing additional software or creating an account.
          </p>
          <p>
            I wanted to build a unified platform that:
          </p>
          <ul style={ulStyle}>
            <li>Work directly in your browser, without uploading your files to a server I control.</li>
            <li>Download spatial data from ArcGIS REST services and explore publicly available layers on ArcGIS Online.</li>
            <li>Convert common GIS formats, including Shapefile, GeoJSON, KML, GeoPackage, CSV, and GPX.</li>
            <li>Preview layers on an interactive map and inspect their attribute tables before exporting.</li>
            <li>Make everyday GIS data tasks available for free, without artificial feature limits or paywalls.</li>
          </ul>
          <p>
            That's exactly what {siteName} delivers. It's the comprehensive tool I wished
            existed when I first started working with GIS data.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>About the Developer</h2>
          <p>
            I'm <strong>Muhammad Junaid Baig</strong>, a geospatial developer with experience in 
            web mapping, ArcGIS Enterprise, ArcGIS Online, and spatial data processing.
          </p>
          <p>
            Over the years I've worked with a wide range of spatial data
            sources, municipal parcel data, zoning districts, utility
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
          <h2 style={h2Style}>What You Can Do With the Tool</h2>
          <p>{siteName} provides three main workflows:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Load data directly from a URL :</strong> Paste any ArcGIS REST
              Paste an ArcGIS REST FeatureServer, MapServer, or supported WFS endpoint to inspect the service, browse its available layers, and preview spatial data on an interactive map. You can then view the attribute table and export the data in a supported format.
            </li>
            <li>
              <strong>Discover public ArcGIS Online layers :</strong> Search for publicly available feature services and open data layers on ArcGIS Online. This is useful when you know what data you're looking for but don't already have a service URL.
            </li>
            <li>
              <strong>Convert your existing GIS files :</strong> Upload supported spatial files from your computer and convert them into another format directly in your browser. You can use this workflow to prepare data for different GIS applications without needing a separate conversion program.
            </li>
          </ul>
          <p>
            The original files remain on your computer during local file conversion, and the tool is designed to preserve spatial and attribute information wherever the target format supports it.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Supported GIS Formats</h2>
          <p style={{ marginBottom: '1rem' }}>
            The tool supports the following formats for its applicable download and conversion workflows:
          </p>
          <ul style={ulStyle}>
            <li><strong>Shapefile (.zip)</strong> A widely used vector format, packaged with its required supporting files.</li>
            <li><strong>GeoJSON (.geojson)</strong> A convenient format for web mapping and exchanging spatial data.</li>
            <li><strong>KML (.kml)</strong> Useful for Google Earth and other compatible mapping applications.</li>
            <li><strong>GeoPackage (.gpkg)</strong> A versatile, SQLite-based format for storing geospatial data.</li>
            <li><strong>CSV (.csv)</strong> Tabular data, with optional spatial information such as coordinates or WKT geometry.</li>
            <li><strong>GPX (.gpx)</strong> Commonly used for GPS tracks, routes, and waypoints.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Built With Privacy in Mind</h2>
          <p>
            Built With Privacy in Mind

One of the decisions I made early in development was to keep data processing on the client side.

Local file conversion, processing, and export run in your browser using JavaScript and WebAssembly. Files you upload for local processing are not sent to a server I control. When you load data from an external GIS service, your browser communicates directly with that service to retrieve the requested information.

This approach helps keep your files under your control while making the tool accessible through an ordinary web browser.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>How It Works</h2>
          <p>
            Geo Server Data Downloader <strong>React</strong>, <strong>Vite</strong>,{' '}
            <strong>TypeScript</strong>, <strong>Tailwind CSS</strong>, and the{' '}
            <strong>ArcGIS Maps SDK for JavaScript</strong>. For data processing and format conversion, it uses  <strong>gdal3.js</strong> (a WebAssembly 
            port of the industry-standard GDAL library). The application is hosted as a static website, allowing users to access its tools without installing a desktop application.
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
            Thanks for checking out Geo Server Data Downloader. I hope it makes your GIS work a little easier.
          </p>
        </section>
      </article>
    </>
  );
};

export default About;