/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F2E8",
        panel: "#FFFFFF",
        ink: "#12131A",
        inksoft: "#4A4B54",
        cobalt: "#1D4FEB",
        gold: "#FFC72C",
        kelly: "#14A44D",
        crimson: "#E8232B",
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        hard: "5px 5px 0 #12131A",
        "hard-sm": "3px 3px 0 #12131A",
        "hard-cobalt": "8px 8px 0 #1D4FEB",
      },
    },
  },
  plugins: [],
}