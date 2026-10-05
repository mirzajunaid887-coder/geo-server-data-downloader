import React from 'react';
import { SEO } from '../components/SEO';
import { APP_CONFIG } from '../config/app';

export const Privacy: React.FC = () => {
  const siteName = APP_CONFIG.APP_NAME;
  const siteDomain = APP_CONFIG.APP_DOMAIN;
  const contactEmail = 'gisgynix@gmail.com';
  const lastUpdated = 'October 5, 2026';

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy policy for Geo Server Data Downloader. Learn how we handle data, cookies, and third-party advertising including Google AdSense."
        path="/privacy"
      />

      <article style={articleStyle}>
        <header>
          <h1 style={h1Style}>Privacy Policy</h1>
          <p style={metaStyle}>Last updated: {lastUpdated}</p>
        </header>

        <section style={sectionStyle}>
          <p>
            At <strong>{siteName}</strong>, accessible from{' '}
            <a href={`${siteDomain}`} style={linkStyle}>
              {siteDomain}
            </a>
            , the privacy of our visitors is one of our main priorities. This
            Privacy Policy document explains what information we collect, how
            we use it, and the choices you have.
          </p>
          <p>
            By using our website, you consent to this Privacy Policy and agree
            to its terms. If you do not agree, please discontinue use of the
            site.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p>
            <strong>{siteName}</strong> is a client-side web application. All
            geospatial processing (querying ArcGIS REST services, converting
            features, and generating export files) happens entirely in your
            browser. We do <strong>not</strong> upload your data, the URLs you
            paste, or the exported files to any server we control.
          </p>
          <p>However, we may collect the following limited categories of information:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Log data:</strong> Like most websites, our hosting
              provider may log standard request information such as your IP
              address, browser type, operating system, referring pages, and
              timestamps. This is used solely for security and analytics.
            </li>
            <li>
              <strong>Cookies:</strong> Small text files placed on your device
              by us or by third-party services (including advertising
              partners). See Section 4 for details.
            </li>
            <li>
              <strong>Local storage:</strong> We store your theme preference
              (light/dark) in your browser's local storage. This never leaves
              your device.
            </li>
            <li>
              <strong>Voluntary contact:</strong> If you email us, we receive
              your email address and any information you choose to share.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <ul style={ulStyle}>
            <li>To operate, maintain, and improve the website and its tools.</li>
            <li>To detect, prevent, and address technical issues or abuse.</li>
            <li>To respond to your questions or support requests.</li>
            <li>To display relevant advertising through third-party partners.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>3. Third-Party Services</h2>
          <p>
            Our tool interacts with third-party geospatial services such as
            ArcGIS Online, Esri FeatureServers, and Web Feature Services
            (WFS). When you load a service URL, your browser makes requests
            directly to those services, which are governed by their own
            privacy policies. We have no control over, and take no
            responsibility for, the content or practices of those third
            parties.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>4. Cookies and Web Beacons</h2>
          <p>
            Like any other website, <strong>{siteName}</strong> uses cookies.
            Cookies are used to store information including visitors'
            preferences and the pages on the website that the visitor
            accessed or visited. The information is used to optimize the
            users' experience by customizing our web page content based on
            visitors' browser type and other information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>5. Google AdSense and Advertising Partners</h2>
          <p>
            We may use <strong>Google AdSense</strong> and other third-party
            advertising networks to serve ads on this website. These partners
            may use cookies, web beacons, or similar technologies to collect
            information about your visits to this and other websites in order
            to provide advertisements about goods and services of interest to
            you.
          </p>
          <ul style={ulStyle}>
            <li>
              Third-party vendors, including <strong>Google</strong>, use
              cookies to serve ads based on a user's prior visits to this
              website or other websites.
            </li>
            <li>
              Google's use of advertising cookies enables it and its partners
              to serve ads to our users based on their visit to our site
              and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Alternatively, users may opt out of some third-party vendors'
              use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
          <p>
            Google's advertising requirements can be summed up in Google's
            Advertising Principles. They are put in place to provide a
            positive experience for users. For more information about how
            Google handles data, please visit the{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Google Advertising Privacy &amp; Terms
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>6. Advertising Partners</h2>
          <p>
            Some of our advertising partners may use cookies and web beacons
            on our site. Each partner has its own Privacy Policy covering how
            they handle user data. For your convenience, you can review the
            privacy policies of our advertising partners via the links
            provided in their respective ad units, or through Google's
            AdSense program.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>7. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Access:</strong> Request a copy of the personal data we
              hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request that we correct inaccurate
              information.
            </li>
            <li>
              <strong>Deletion:</strong> Request that we delete your data.
            </li>
            <li>
              <strong>Opt-out of personalized ads:</strong> Use the links in
              Section 5 above.
            </li>
            <li>
              <strong>Disable cookies:</strong> Most browsers allow you to
              block or delete cookies via their settings.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} style={linkStyle}>
              {contactEmail}
            </a>
            .
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>8. GDPR (European Users)</h2>
          <p>
            If you are located in the European Economic Area (EEA), you have
            rights under the General Data Protection Regulation (GDPR). Our
            lawful bases for processing data include your consent, our
            legitimate interests in operating the site, and compliance with
            legal obligations. You have the right to lodge a complaint with
            your local supervisory authority.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>9. CCPA (California Users)</h2>
          <p>
            If you are a California resident, you have the right under the
            California Consumer Privacy Act (CCPA) to know what personal
            information is collected, request deletion, and opt out of the
            "sale" of personal information. We do not sell your personal
            information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>10. Children's Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13. We
            do not knowingly collect personal identifiable information from
            children. If you believe your child provided such information on
            our website, please contact us immediately, and we will do our
            best to promptly remove such information from our records.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>11. Data Security</h2>
          <p>
            We use commercially reasonable safeguards to protect the limited
            data we handle. However, no method of transmission over the
            Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do,
            we will revise the "Last updated" date at the top of this page.
            Continued use of the website after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>13. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy,
            please contact us:
          </p>
          <ul style={ulStyle}>
            <li>
              Email:{' '}
              <a href={`mailto:${contactEmail}`} style={linkStyle}>
                {contactEmail}
              </a>
            </li>
            <li>
              Website:{' '}
              <a href={`${siteDomain}`} style={linkStyle}>
                {siteDomain}
              </a>
            </li>
          </ul>
        </section>
      </article>
    </>
  );
};

/* ---------- Shared article styles (reuse in Terms, About, Documentation) ---------- */
export const articleStyle: React.CSSProperties = {
  maxWidth: '56rem',
  margin: '0 auto',
  padding: '2rem 1rem 3rem',
  color: 'var(--text-main)',
  lineHeight: 1.75,
  fontSize: '0.95rem',
};

export const h1Style: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
  fontWeight: 800,
  margin: '0 0 0.25rem',
  color: 'var(--text-main)',
};

export const h2Style: React.CSSProperties = {
  fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
  fontWeight: 700,
  margin: '0 0 0.75rem',
  color: 'var(--text-main)',
};

export const metaStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  margin: '0 0 1.5rem',
};

export const sectionStyle: React.CSSProperties = {
  marginBottom: '2rem',
};

export const ulStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  margin: '0.5rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

export const linkStyle: React.CSSProperties = {
  color: 'var(--accent-color)',
  textDecoration: 'underline',
  wordBreak: 'break-word',
};

export default Privacy;