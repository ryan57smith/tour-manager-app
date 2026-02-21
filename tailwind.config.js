/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        night: '#0a0a0f',
        stage: '#111118',
        rail: '#1a1a24',
        amber: {
          glow: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
