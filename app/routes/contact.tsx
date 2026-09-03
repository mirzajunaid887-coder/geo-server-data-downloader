import React, { useState } from 'react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Contact Us</h1>
      <p>Have questions or feedback? Feel free to reach out to us using the form below.</p>

      {submitted ? (
        <div style={{ padding: '16px', backgroundColor: '#e6fffa', border: '1px solid #38b2ac', borderRadius: '6px', marginTop: '24px' }}>
          Thank you for reaching out! We will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Name</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Email</label>
            <input 
              type="email" 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Message</label>
            <textarea 
              rows={5} 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '10px 16px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start' }}
          >
            Send Message
          </button>
        </form>
      )}
    </main>
  );
}