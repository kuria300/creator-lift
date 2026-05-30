/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        teko: ['Teko', 'sans-serif'],
      },
      backgroundImage: {
        ttuPattern: "url('./star.jpg')",
       },
      colors:{
        black100: 'var(--black-100)',
        black95: 'var(--black-95)',
        black80: 'var(--black-80)',
        black90: 'var(--black-90)',
        white2:'var(--white-2-21)'

      }
    },
  },
  plugins: [],
}