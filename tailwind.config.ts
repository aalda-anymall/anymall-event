import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans-jp)", "sans-serif"],
        serif: ["var(--font-noto-serif-jp)", "serif"],
      },
      maxWidth: {
        "6xl": "72rem",
      },
      colors: {
        brand: {
          green: "#7cb342",
          "green-dark": "#689638",
          "green-text": "#5a8f6e",
          "green-bg": "#eef2e6",
          "green-accent": "#3d5a3d",
          "green-light": "#d2debb",
          olive: "#7a9b6d",
        },
        warm: {
          50: "#f7f5f0",
          100: "#f2eee6",
          200: "#e8e4db",
          300: "#e8e2da",
          400: "#c0b8ad",
          500: "#7a7067",
          600: "#5c5c5c",
          700: "#48604d",
          800: "#3d3d3d",
          900: "#2c2520",
          accent: "#C4A882",
        },
        status: {
          amber: "#d48806",
          "amber-bg": "#fef8f0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
