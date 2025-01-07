/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    screens: {
      'xs': '320px',   // Extra small devices
      'sm': '640px',   // Small devices
      'md': '768px',   // Medium devices
      'lg': '1024px',  // Large devices
      'xl': '1280px',  // Extra large devices
      '2xl': '1536px', // 2X large devices
    },
    extend: {
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
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          ...Array.from({length: 10}, (_, i) => ({
            [`${(i + 1) * 10}`]: `color-mix(in srgb, var(--primary) ${(i + 1) * 10}%, white)`,
          })).reduce((acc, curr) => ({...acc, ...curr}), {}),
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADDBFF',
          300: '#84CAFF',
          400: '#5AB9FF',
          500: '#4A90E2',
          600: '#3A77C4',
          700: '#2A5EA6',
          800: '#1A4588',
          900: '#0A2C6A',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          ...Array.from({length: 10}, (_, i) => ({
            [`${(i + 1) * 10}`]: `color-mix(in srgb, var(--secondary) ${(i + 1) * 10}%, white)`,
          })).reduce((acc, curr) => ({...acc, ...curr}), {}),
          50: '#FFF4E5',
          100: '#FFEACC',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#F5A623',
          600: '#D68C1A',
          700: '#B87311',
          800: '#9A5A08',
          900: '#7C4100',
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
          accent: 'rgba(80, 227, 194, 0.5)' // Accent color with opacity
        },
        text: {
          primary: {
            light: 'var(--text-primary)',
            dark: 'var(--text-primary-dark, var(--text-primary))',
          },
          secondary: {
            light: 'var(--text-secondary)',
            dark: 'var(--text-secondary-dark, var(--text-secondary))',
          }
        },
        neutralBackground: {
          100: 'var(--neutral-background-100, #F5F5F5)',
        },
        neutralText: {
          500: 'var(--neutral-text-500, #6B7280)',
          700: 'var(--neutral-text-700, #374151)',
        }
      },
      ringColor: {
        DEFAULT: 'rgba(74, 144, 226, 0.5)', // Primary color with opacity
        primary: 'rgba(74, 144, 226, 0.5)',
        secondary: 'rgba(245, 166, 35, 0.5)',
        accent: 'rgba(80, 227, 194, 0.5)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs-mobile': '0.65rem',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
