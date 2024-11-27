/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,php}"],
  theme: {
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

