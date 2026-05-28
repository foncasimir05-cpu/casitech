/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0a0f',
        bg2:     '#0e0e16',
        card:    '#13131e',
        card2:   '#1a1a28',
        green:   '#00c853',
        greenL:  '#69f0ae',
        greenD:  '#007a32',
        muted:   '#7a8a8f',
        border:  '#1e2a2e',
        cyan:    '#00e5ff',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        mono:     ['Share Tech Mono', 'monospace'],
        body:     ['Exo 2', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
