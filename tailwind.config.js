/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'noise-pattern': "url('/noise.png')",
      },
      animation: {
        'speaking-wave': 'speakingWave 4s infinite ease-in-out',
        'listening': 'listen 5s infinite ease-in-out',
      },
      keyframes: {
        listen: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.9)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1'},
        },
        speakingWave: {
          '0%, 100%': { height: '20%' },
          '10%': { height: '80%' },
          '20%': { height: '50%' },
          '30%': { height: '70%' },
          '40%': { height: '30%' },
          '50%': { height: '90%' },
          '60%': { height: '40%' },
          '70%': { height: '60%' },
          '80%': { height: '20%' },
          '90%': { height: '80%' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
