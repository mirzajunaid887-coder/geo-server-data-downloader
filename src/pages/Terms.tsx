import React from 'react';
import { SEO } from '../components/SEO';
import { APP_CONFIG } from '../config/app';
import { articleStyle, h1Style, h2Style, metaStyle, sectionStyle, ulStyle, linkStyle } from './Privacy';

export const Terms: React.FC = () => {
  const siteName = APP_CONFIG.APP_NAME;
  const siteDomain = APP_CONFIG.APP_DOMAIN;
  const contactEmail = 'gisgynix@gmail.com';
  const lastUpdated = 'October 5, 2026';

  return (
    <>
      <SEO
        title="Terms of Service"
        description={`Terms of Service for${siteName}. Read the rules for using our free browser-based GIS data downloader.`}
        path="/terms"
      />

      <article style={articleStyle}>
        <header>
          <h1 style={h1Style}>Terms of Service</h1>
          <p style={metaStyle}>Last updated: {lastUpdated}</p>
        </header>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>{siteName}</strong> (the "Service"),
            available at{' '}
            <a href={`${siteDomain}`} style={linkStyle}>
              {siteDomain}
            </a>
            , you agree to be bound by these Terms of Service. If you do not
            agree with any part of these terms, you must not use the Service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. Description of the Service</h2>
          <p>
            {siteName} is a free, browser-based tool that allows users to
            connect to publicly accessible ArcGIS REST services, Web Feature
            Services (WFS), and ArcGIS Online datasets, and to export the
            resulting features as Shapefile, GeoJSON, KML, GeoPackage, CSV,
            GPX, or other supported formats.
          </p>
          <p>
            All processing occurs locally in your web browser. We do not
            store, host, or transmit your data, layer URLs, or exported
            files.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Eligibility</h2>
          <p>
            You must be at least 13 years of age to use the Service. By using
            the Service, you represent and warrant that you meet this
            requirement and that you have the legal authority to enter into
            these Terms.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Acceptable Use</h2>
          <p>You agree NOT to use the Service to:</p>
          <ul style={ulStyle}>
            <li>Access, download, or redistribute data you do not have permission to access.</li>
            <li>Bypass authentication, tokens, or access controls on any service.</li>
            <li>Violate the terms of service of any third-party GIS or data provider.</li>
            <li>Infringe any intellectual property or proprietary rights.</li>
            <li>Engage in unauthorized scraping, mass-download abuse, or denial-of-service activity.</li>
            <li>Upload or transmit malware, viruses, or any harmful code.</li>
            <li>Use the Service in any way that is unlawful or harms others.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Third-Party Data and Services</h2>
          <p>
            The Service allows you to connect to third-party geospatial
            services. You acknowledge that:
          </p>
          <ul style={ulStyle}>
            <li>We do not own or control any third-party data sources.</li>
            <li>You are solely responsible for complying with the terms of any data source you access.</li>
            <li>We are not liable for the accuracy, legality, or availability of third-party data.</li>
            <li>Any restriction, token, license, or fee imposed by a data owner is your responsibility.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Intellectual Property</h2>
          <p>
            The Service, including its source code, design, and branding, is
            the intellectual property of {siteName} and its creator. You may
            not copy, modify, distribute, sell, or lease any part of the
            Service without prior written permission, except as permitted by
            applicable open-source licenses.
          </p>
          <p>
            Data you export from third-party services remains the property of
            the original data owner. You retain full responsibility for
            complying with any license attached to it.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. No Warranty</h2>
          <p>
            The Service is provided "AS IS" and "AS AVAILABLE" without
            warranties of any kind, express or implied, including but not
            limited to merchantability, fitness for a particular purpose, or
            non-infringement. We do not warrant that the Service will be
            uninterrupted, error-free, or that any data obtained through it
            will be accurate or reliable.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {siteName} and its
            creator shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including loss of
            profits, data, or goodwill, arising out of or in connection with
            your use of the Service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless {siteName} and its
            creator from any claim, demand, loss, or expense arising from
            your use of the Service or your violation of these Terms.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>10. Changes to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the
            Service at any time, without notice or liability. We may also
            update these Terms; continued use after changes constitutes
            acceptance.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which the site owner resides,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>12. Contact</h2>
          <p>
            For any questions about these Terms, please contact:{' '}
            <a href={`mailto:${contactEmail}`} style={linkStyle}>
              {contactEmail}
            </a>
          </p>
        </section>
      </article>
    </>
  );
};

export default Terms;