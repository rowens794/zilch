const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        harshDkRed: "5px 5px 1px rgba(127,29,29,1)",
        harshYellow: "5px 5px 1px rgba(253,224,71,.5)",
      },
      scale: {
        500: "5.00",
      },
    },
  },
  colors: {
    // Colors you want to add go here
    transparent: "transparent",
    current: "currentColor",
    primary: colors.red,
    gray: colors.stone,
  },
  plugins: [],
};
