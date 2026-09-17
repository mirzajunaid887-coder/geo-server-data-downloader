import React from 'react';
import { APP_CONFIG } from '../config/app';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        By accessing {APP_CONFIG.APP_DOMAIN}, you agree to be bound by these terms of service and comply with all applicable laws and regulations.
      </p>
    </div>
  );
};