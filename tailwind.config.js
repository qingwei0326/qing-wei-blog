/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f5f7',
          100: '#ebebed',
          200: '#d2d2d7',
          300: '#a1a1a6',
          400: '#6e6e73',
          500: '#3a3a3c',
          600: '#2c2c2e',
          700: '#1d1d1f',
          800: '#1c1c1e',
          900: '#000000',
        },
        accent: {
          DEFAULT: '#0071e3',
          hover: '#0077ed',
          dark: '#0a84ff',
          darkHover: '#409cff',
        },
      },
      fontFamily: {
        sans: [
          'system-ui', '-apple-system', 'BlinkMacSystemFont',
          '"Segoe UI Variable"', '"Segoe UI"',
          '"PingFang SC"', '"Hiragino Sans GB"',
          '"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif',
        ],
        mono: [
          'ui-monospace', 'SFMono-Regular', '"SF Mono"',
          '"Cascadia Code"', '"JetBrains Mono"',
          'Consolas', 'Menlo', 'monospace',
        ],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'soft-dark': '0 2px 12px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
