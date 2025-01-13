/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    screens: {
      xs: '320px', // Extra small devices
      sm: '640px', // Small devices
      md: '768px', // Medium devices
      lg: '1024px', // Large devices
      xl: '1280px', // Extra large devices
      '2xl': '1536px', // 2X large devices
    },
    extend: {
      fontFamily: {
        // Add a modern sans-serif font stack
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          50: '#f0f5ff',
          100: '#e6edff',
          200: '#c3dafe',
          300: '#a3bffa',
          400: '#7f9cf5',
          500: '#667eea', // Base primary color
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
          DEFAULT: '#4A90E2',
          ...Array.from({ length: 10 }, (_, i) => ({
            [`${(i + 1) * 10}`]: `color-mix(in srgb, var(--primary) ${(i + 1) * 10}%, white)`,
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        },
        secondary: {
          50: '#f9fafb',
          100: '#f4f5f7',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd', // Base secondary color
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          DEFAULT: '#F5A623',
          ...Array.from({ length: 10 }, (_, i) => ({
            [`${(i + 1) * 10}`]: `color-mix(in srgb, var(--secondary) ${(i + 1) * 10}%, white)`,
          })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: {
          DEFAULT: 'rgba(74, 144, 226, 0.5)', // Primary color with opacity
          primary: 'rgba(74, 144, 226, 0.5)', // Same as default
          secondary: 'rgba(245, 166, 35, 0.5)', // Secondary color with opacity
          accent: 'rgba(80, 227, 194, 0.5)', // Accent color with opacity
        },
        text: {
          primary: {
            light: 'var(--text-primary)',
            dark: 'var(--text-primary-dark, var(--text-primary))',
          },
          secondary: {
            light: 'var(--text-secondary)',
            dark: 'var(--text-secondary-dark, var(--text-secondary))',
          },
        },
        neutralBackground: {
          100: 'var(--neutral-background-100, #F5F5F5)',
        },
        neutralText: {
          500: 'var(--neutral-text-500, #6B7280)',
          700: 'var(--neutral-text-700, #374151)',
        },
      },
      ringOpacity: {
        DEFAULT: '0.5',
        primary: '0.5',
      },
      outlineColor: {
        primary: 'var(--primary)',
      },
      ringColor: {
        primary: 'rgba(74, 144, 226, 0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg-purple':
          '0 10px 15px -3px rgba(124, 58, 237, 0.2), 0 4px 6px -2px rgba(124, 58, 237, 0.1)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':
          'linear-gradient(to right, rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1))',
      },
      fontSize: {
        'xs-mobile': '0.65rem',
      },
    },
  },
  plugins: [
    forms,
    typography,
    function ({ addBase, theme }) {
      addBase({
        '::selection': {
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.white'),
        },
      });
    },
  ],
};
