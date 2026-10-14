import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './app/App';
import './styles/globals.css';

const rootElement = document.getElementById('root')!;

if (rootElement.hasChildNodes()) {
  // The root has children, meaning this page was prerendered.
  // We hydrate it to attach React's event handlers.
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  // The root is empty (local development).
  // Render the app from scratch.
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}