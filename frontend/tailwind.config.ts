import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: {
          DEFAULT: "#101010",
          card: "#151515",
          border: "#262626",
          hover: "#1F1F1F",
        },
        medpink: {
          50: "#FFF0F6",
          100: "#FFD6E7",
          200: "#FFB6D5", // Secondary pink
          300: "#FF8ABF",
          400: "#FF66AB",
          500: "#FF4D9D", // Primary pink
          600: "#E63584",
          700: "#C41C6C",
          800: "#991053",
          900: "#730A3E",
          glow: "rgba(255, 77, 157, 0.35)",
        },
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#71717A",
        }
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 77, 157, 0.35)",
        glowSubtle: "0 0 15px -3px rgba(255, 77, 157, 0.15)",
        glowLg: "0 0 40px -10px rgba(255, 77, 157, 0.45)",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.1)" },
          "70%": { transform: "scale(1)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
