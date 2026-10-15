import { themeBase, themeColors } from "./theme.palette.js";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tokens da marca (docs/Apliquefy_Identidade_Visual/06_Tokens), usados pelo funil /lp.
      colors: {
        ...themeColors,
        ap: {
          ink: "#14121C",
          purple: "#7A3BFF",
          "purple-hover": "#6527DC",
          "purple-active": "#5420BF",
          orange: "#FF7A00",
          green: "#22D36A",
          surface: "#F6F4FA",
          "surface-purple": "#F0E9FF",
          border: "#D8D4E2",
          muted: "#625D6C",
          success: "#08773A",
          "success-surface": "#EAF8EF",
          warning: "#A64500",
          "warning-surface": "#FFF2E6",
          error: "#B42318",
          "error-surface": "#FFF0EE",
        },
      },
      fontFamily: {
        "ap-display": ["var(--font-ap-display)", "system-ui", "sans-serif"],
        "ap-body": ["var(--font-ap-body)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: { "ap-tag": "6px", "ap-control": "10px", "ap-card": "16px" },
    },
  },
  plugins: [({ addBase }) => addBase(themeBase)],
};