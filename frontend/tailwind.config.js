/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070b14",
          900: "#0b1220",
          800: "#111a2e",
          700: "#18243d",
        },
        steel: {
          400: "#8b9bb4",
          300: "#b7c3d6",
        },
        signal: {
          ok: "#2dd4a0",
          warn: "#f5b942",
          bad: "#f07178",
          info: "#4cc3ff",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 18px 40px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
