import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './app/App';
import './styles/globals.css';

// Global error handler for mobile debugging (iOS Safari)
window.addEventListener('error', function (event) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    // Only replace if the app actually crashed and went blank
    root.innerHTML = `<div style="color: #ef4444; padding: 20px; font-family: sans-serif; background: #020617; height: 100vh;">
      <h2 style="margin-bottom: 10px; font-size: 20px;">Application Error</h2>
      <p style="margin-bottom: 10px; font-size: 14px; color: #94a3b8;">The app encountered an error on this device.</p>
      <pre style="background: #1e293b; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 12px; color: #f8fafc;">${event.message}\n\n${event.filename}:${event.lineno}</pre>
      <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px;">Reload Page</button>
    </div>`;
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);