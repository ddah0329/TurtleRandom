const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans KR", ...defaultTheme.fontFamily.sans],
        black: ["Noto Sans KR Black", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "2xs": "10px",
      },
    },
  },
  plugins: [],
};
