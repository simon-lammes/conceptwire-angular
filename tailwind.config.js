/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: "var(--border)",
          highlight: "var(--border-highlight)",
        },
        foreground: {
          subtle: "var(--foreground-subtle)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
