/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // toate fișierele din src
      "./public/index.html"         // include și HTML dacă există
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  