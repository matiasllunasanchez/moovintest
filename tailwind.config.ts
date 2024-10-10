import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#102833",
        secondary: "#B1302F",
        neutral: "#D7D9D7",
        black: "#020617",
        white: "#ffffff",
        gray: "#F1F1F1",
        confirm: {
          DEFAULT: "#1A8245",
          text: "#1A8245",
          background: "#DAF8E6",
        },
        pending: {
          DEFAULT: "#D97706",
          text: "#D97706",
          background: "#FFFBEB",
        },
        cancelled: {
          DEFAULT: "#EF4444",
          text: "#EF4444",
          background: "#FEEBEB",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
