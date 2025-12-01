/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
          light: '#f3e8ff',
          glow: 'rgba(168, 85, 247, 0.25)',
        },
        bg: {
          DEFAULT: '#0a0a0b',
          elevated: '#141416',
          card: '#1c1c1f',
          input: '#232326',
        },
        border: {
          DEFAULT: '#2a2a2e',
          light: '#3a3a3f',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        success: {
          DEFAULT: '#22c55e',
          bg: 'rgba(34, 197, 94, 0.15)',
        },
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
