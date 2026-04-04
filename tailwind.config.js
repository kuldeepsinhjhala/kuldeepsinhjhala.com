/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        70: '17.5rem',
      },
      colors: {
        'bg': 'var(--c-bg)',
        'card': 'var(--c-card)',
        'head': 'var(--c-head)',
        'body': 'var(--c-body)',
        'gold': 'var(--c-gold)',
        'success': 'var(--c-success)',
        'error': 'var(--c-error)',
        'shadow': 'var(--c-shadow)',
      },
    },
  },
  plugins: [],
}

