/** @type {import('tailwindcss').Config} */
    export default {
      darkMode: 'class',
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./App.jsx",
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Rubik', 'system-ui', 'sans-serif'],
            rubik: ['Rubik', 'system-ui', 'sans-serif'],
            display: ['Cubano', 'Rubik', 'system-ui', 'sans-serif'],
            mono: ['Roboto Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#eafbf1',
              100: '#c8f2da',
              200: '#92e4b8',
              300: '#5bd093',
              400: '#22d97a',
              500: '#0a9650',
              600: '#067C40',
              700: '#055430',
              800: '#043d23',
              900: '#032a18',
            },
          },
          animation: {
            'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
        },
      },
      plugins: [],
    }