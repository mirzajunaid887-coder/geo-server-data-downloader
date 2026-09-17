import React from 'react';
import { APP_CONFIG } from '../config/app';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        At {APP_CONFIG.APP_NAME}, accessible from {APP_CONFIG.APP_DOMAIN}, your privacy is important to us. This Privacy Policy document outlines types of information collected and recorded by our application.
      </p>
    </div>
  );
};