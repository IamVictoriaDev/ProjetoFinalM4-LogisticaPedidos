/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        brandPurple: {
          50: "#fbf7ff",
          100: "#f5eeff",
          200: "#ecd7ff",
          300: "#d6b8ff",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        brandOrange: {
          50: "#fff7f0",
          100: "#fff0e6",
          200: "#ffead1",
          300: "#ffb68a",
          500: "#ff7a00",
          600: "#ff6200",
        },
        brandBlue: {
          50: "#f5fbff",
          100: "#e6f7ff",
          200: "#d0efff",
          300: "#b3e1ff",
          500: "#4aa3ff",
          600: "#2b8cff",
          700: "#1f6fcc",
        },
        brandFuchsia: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          500: "#c084fc",
          600: "#a855f7",
          700: "#9333ea",
        },
        brandGreen: {
          50: "#f6fff6",
          100: "#ecfff0",
          200: "#d3fbe6",
          300: "#bff6d0",
          500: "#34d399",
          600: "#10b981",
          700: "#0f9e6f",
        },
      },
    },
  },
  plugins: [],
};
