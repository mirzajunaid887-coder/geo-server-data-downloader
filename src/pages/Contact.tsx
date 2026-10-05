import React from 'react';
import { Mail, Briefcase, MessageCircle, Linkedin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { articleStyle, h1Style, h2Style, sectionStyle, linkStyle } from './Privacy';

const CONTACT = {
  email: 'gisgynix@gmail.com',
  fiverr: 'https://www.fiverr.com/gisgynix',
  upwork: 'https://www.upwork.com/freelancers/~014c5dfcb05a8b2acb',
  linkedin: 'https://www.linkedin.com/in/muhammad-junaid-baig-38b102247/',
};

export const Contact: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with the developer behind Geo Server Data Downloader for support, feature requests, bug reports, or freelance GIS work."
        path="/contact"
      />

      <article style={articleStyle}>
        <h1 style={h1Style}>Contact</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Have a question, spotted a bug, or want to hire me for a GIS
          project? Here's how to reach me.
        </p>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Email</h2>
          <p>
            The fastest way to get a response is by email. I usually reply
            within 1–2 business days.
          </p>
          <p>
            <a
              href={`mailto:${CONTACT.email}`}
              style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Mail style={{ width: '1rem', height: '1rem' }} />
              {CONTACT.email}
            </a>
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Freelance GIS Work</h2>
          <p>
            I'm available for hire on Fiverr and Upwork. If you need help
            with:
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Building a custom GIS web application</li>
            <li>Automating spatial data extraction or conversion</li>
            <li>Migrating or integrating ArcGIS REST services</li>
            <li>Debugging an existing geospatial workflow</li>
          </ul>
          <p>Feel free to reach out on either platform:</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <a
                href={CONTACT.fiverr}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <MessageCircle style={{ width: '1rem', height: '1rem' }} />
                Fiverr — gisgynix
              </a>
            </li>
            <li>
              <a
                href={CONTACT.upwork}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Briefcase style={{ width: '1rem', height: '1rem' }} />
                Upwork — Muhammad Junaid Baig
              </a>
            </li>
            <li>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Linkedin style={{ width: '1rem', height: '1rem' }} />
                LinkedIn
              </a>
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={h2Style}>Bug Reports and Feature Requests</h2>
          <p>
            Found something broken or have an idea for a feature? Send me an
            email with a short description and, if possible, the service URL
            you were trying to load. I keep a running list of improvements.
          </p>
        </section>
      </article>
    </>
  );
};

export default Contact;