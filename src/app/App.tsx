import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AppRoutes } from './routes';

export function App() {
  // Dynamically set basename: empty string for local development, repository path for production
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basename = isLocal ? '' : '/gis-layer-downloader';

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Header />
        <main className="flex-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;