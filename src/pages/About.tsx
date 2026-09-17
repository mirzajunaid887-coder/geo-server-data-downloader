import React from 'react';
import { APP_CONFIG } from '../config/app';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">About {APP_CONFIG.APP_NAME}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {APP_CONFIG.APP_NAME} is a high-performance, client-side web application built for GIS professionals, researchers, and developers who need reliable access to vector spatial datasets without cumbersome server infrastructure.
      </p>
    </div>
  );
};