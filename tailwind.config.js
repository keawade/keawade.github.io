/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        keawade: {
          50: "#f3f8fb",
          100: "#e8f0f8",
          200: "#c5daed",
          300: "#a2c4e2",
          400: "#5d97cc",
          500: "#176bb6",
          600: "#1560a4",
          700: "#115089",
          800: "#0e406d",
          900: "#0b3459",
        },
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      fontSize: {
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
