import { useState, type FormEvent } from 'react';
import { linkStyle } from '../pages/Privacy';

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  marginTop: 6,
  marginBottom: 16,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  font: 'inherit',
  boxSizing: 'border-box',
};

interface Props {
  fallbackEmail: string;
}

export default function ContactForm({ fallbackEmail }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  // If the key is missing, fall back to a plain mailto link so the page never breaks.
  if (!ACCESS_KEY) {
    return (
      <p>
        Email us at{' '}
        <a href={`mailto:${fallbackEmail}`} style={linkStyle}>
          {fallbackEmail}
        </a>
        .
      </p>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    setError('');

    const data = new FormData(form);
    data.append('access_key', ACCESS_KEY as string);
    data.append('from_name', 'Geo Server Data Downloader contact form');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setError(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <p role="status">
        Thank you. Your message has been sent and I will reply by email soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Your name
        <input name="name" type="text" required maxLength={100} style={fieldStyle} />
      </label>

      <label>
        Your email
        <input name="email" type="email" required maxLength={200} style={fieldStyle} />
      </label>

      <label>
        Subject
        <input name="subject" type="text" required maxLength={150} style={fieldStyle} />
      </label>

      <label>
        Message
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          style={{ ...fieldStyle, resize: 'vertical' }}
        />
      </label>

      {/* Honeypot: hidden from people, bots tend to fill it in */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: 6,
          background: '#2563eb',
          color: '#fff',
          font: 'inherit',
          cursor: status === 'sending' ? 'wait' : 'pointer',
        }}
      >
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>

      {status === 'error' && (
        <p role="alert" style={{ color: '#b91c1c', marginTop: 12 }}>
          {error} You can also email{' '}
          <a href={`mailto:${fallbackEmail}`} style={linkStyle}>
            {fallbackEmail}
          </a>
          .
        </p>
      )}
    </form>
  );
}