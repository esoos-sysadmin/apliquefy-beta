/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tokens do funil /lp (definidos em app/lp/lp.css), namespaced para não vazar no app.
      colors: {
        lp: {
          paper: "var(--lp-paper)",
          field: "var(--lp-field)",
          ink: "var(--lp-ink)",
          ink2: "var(--lp-ink2)",
          rule: "var(--lp-rule)",
          act: "var(--lp-act)",
          est: "var(--lp-est)",
          bad: "var(--lp-bad)",
          ok: "var(--lp-ok)",
        },
      },
      fontFamily: {
        "lp-serif": ["var(--font-lp-serif)", "Georgia", "serif"],
        "lp-sans": ["var(--font-lp-sans)", "system-ui", "sans-serif"],
        "lp-mono": ["var(--font-lp-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};