/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Switched from 'media' to a selector-based mode so that `dark:` classes
  // follow our manual theme toggle (set via <html data-theme="dark">),
  // instead of only tracking the OS-level prefers-color-scheme setting.
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        // Explicit breakpoints used throughout globals.css and hooks.
        // Matches Tailwind defaults, listed here for clarity:
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        // Optional: expose theme tokens as Tailwind utilities so you can
        // write `bg-card`, `text-muted`, `border-line` etc. instead of
        // long arbitrary-value classes. Purely additive — no existing
        // classes are affected.
        app: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          input: 'var(--bg-input)',
          hover: 'var(--bg-hover)',
        },
        content: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        line: {
          DEFAULT: 'var(--border-color)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent-color)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger-color)',
          soft: 'var(--danger-soft)',
        },
        success: {
          DEFAULT: 'var(--success-color)',
          soft: 'var(--success-soft)',
        },
      },
    },
  },
  plugins: [],
}