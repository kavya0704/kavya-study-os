/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc', // StudyOS light background
        surface: {
          DEFAULT: '#ffffff',
          1: '#ffffff',
          2: '#f8fafc',
          3: '#f1f5f9',
          border: '#e2e8f0'
        },
        primary: {
          DEFAULT: '#2563eb', // StudyOS blue
          hover: '#1d4ed8',
          light: '#eff6ff',
          emerald: '#10b981',
          green: '#22c55e',
          blue: '#2563eb'
        },
        accent: {
          amber: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
