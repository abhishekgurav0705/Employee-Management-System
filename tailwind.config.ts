import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(224 14% 15%)",
        muted: "hsl(220 14% 96%)",
        border: "hsl(220 13% 91%)",
        input: "hsl(220 13% 91%)",
        ring: "hsl(224 62% 54%)",
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(224 14% 15%)"
        },
        primary: {
          DEFAULT: "hsl(224 62% 54%)",
          foreground: "hsl(0 0% 100%)"
        },
        secondary: {
          DEFAULT: "hsl(215 16% 47%)",
          foreground: "hsl(0 0% 100%)"
        },
        accent: {
          DEFAULT: "hsl(210 100% 66%)",
          foreground: "hsl(224 14% 15%)"
        },
        success: "hsl(146 45% 45%)",
        warning: "hsl(43 92% 50%)",
        destructive: "hsl(0 84% 60%)"
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.1)"
      }
    }
  },
  plugins: []
};

export default config;
