import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AppRoutes } from './routes';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="app-main">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;