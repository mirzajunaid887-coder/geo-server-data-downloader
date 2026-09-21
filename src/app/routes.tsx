import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Downloader } from '../pages/Downloader';
import { Discover } from '../pages/Discover';
import { Documentation } from '../pages/Documentation';
import { About } from '../pages/About';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { ExportProgress } from '../pages/ExportProgress';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/downloader" element={<Downloader />} />
      <Route path="/download" element={<Downloader />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      {/* Standalone route for background layer exporting */}
      <Route path="/export-progress" element={<ExportProgress />} />
    </Routes>
  );
};