import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Colors ──────────────────────────────────────────────────────────────
      colors: {
        "surface":                   "#131313",
        "surface-dim":               "#131313",
        "surface-bright":            "#3a3939",
        "surface-container-lowest":  "#0e0e0e",
        "surface-container-low":     "#1c1b1b",
        "surface-container":         "#201f1f",
        "surface-container-high":    "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant":           "#353534",
        "surface-tint":              "#b7c4ff",
        "on-surface":                "#e5e2e1",
        "on-surface-variant":        "#c6c5d1",
        "inverse-surface":           "#e5e2e1",
        "inverse-on-surface":        "#313030",
        "background":                "#131313",
        "on-background":             "#e5e2e1",
        "primary":                   "#b7c4ff",
        "on-primary":                "#1b2b68",
        "primary-container":         "#0b1e5b",
        "on-primary-container":      "#7988ca",
        "primary-fixed":             "#dde1ff",
        "primary-fixed-dim":         "#b7c4ff",
        "on-primary-fixed":          "#001453",
        "on-primary-fixed-variant":  "#334380",
        "inverse-primary":           "#4b5b99",
        "secondary":                 "#b6c4ff",
        "on-secondary":              "#00277f",
        "secondary-container":       "#0555f7",
        "on-secondary-container":    "#dee3ff",
        "tertiary":                  "#bfc7d3",
        "on-tertiary":               "#29313a",
        "tertiary-container":        "#1d252e",
        "on-tertiary-container":     "#848c97",
        "error":                     "#ffb4ab",
        "on-error":                  "#690005",
        "error-container":           "#93000a",
        "on-error-container":        "#ffdad6",
        "outline":                   "#8f909b",
        "outline-variant":           "#454650",
      },

      // ─── Font Families ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

      // ─── Font Sizes ──────────────────────────────────────────────────────────
      fontSize: {
        "4xl": ["36px", { lineHeight: "1.1", fontWeight: "800" }],
        "5xl": ["48px", { lineHeight: "1.1", fontWeight: "800" }],
        "6xl": ["64px", { lineHeight: "1.0", fontWeight: "800" }],
      },

      // ─── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        "18": "72px",
        "20": "80px",    // nav height
        "30": "120px",   // section gap
      },

      // ─── Max Width ───────────────────────────────────────────────────────────
      maxWidth: {
        "screen-2xl": "1440px",
      },

      // ─── Box Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        "glass":       "0 10px 30px rgba(0,0,0,0.5)",
        "glass-hover": "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(183,196,255,0.15)",
        "floating":    "0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(30,94,255,0.1)",
        "glow-sm":     "0 0 15px rgba(183,196,255,0.3)",
        "glow-md":     "0 0 25px rgba(183,196,255,0.6)",
        "glow-neon":   "0 0 30px rgba(30,94,255,0.4)",
      },

      // ─── Keyframes ───────────────────────────────────────────────────────────
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(183,196,255,0.3)" },
          "50%":      { boxShadow: "0 0 30px rgba(183,196,255,0.7)" },
        },
        "ping-slow": {
          "0%":        { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.8s ease forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "ping-slow":  "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite",
      },

      // ─── Backdrop Blur ───────────────────────────────────────────────────────
      backdropBlur: {
        "nav":    "24px",
        "card":   "16px",
        "panel":  "20px",
        "strong": "40px",
      },
    },
  },
  plugins: [],
};

export default config;
