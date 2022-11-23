/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "#0D74C4",
        // primary: "#4d7c0f",
        primarylit: "#379FEF",
        // primarylit: "#65a30d",
        secondry: "#5f6366",
        franchise: "#ef5423",
      },
    },
  },
  plugins: [],
};
