import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <section style={{ marginTop: '24px' }}>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us when using our application, such as when you create an account, contact customer support, or interact with our features.</p>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>2. Cookies and Advertising</h2>
        <p>This site uses cookies to personalize content and ads, to provide social media features, and to analyze traffic. We also share information about your use of our site with our advertising and analytics partners.</p>
        <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</p>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>3. Third-Party Links</h2>
        <p>Our service may contain links to external sites that are not operated by us. We strongly advise you to review the Privacy Policy of every site you visit.</p>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
      </section>
    </main>
  );
}