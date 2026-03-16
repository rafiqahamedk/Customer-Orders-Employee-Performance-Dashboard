/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#54bd95",
          dark: "#3da87e",
          light: "#e8f8f2",
        },
        surface: "#ffffff",
        bg: "#f4f6fb",
        border: "#e4e9f0",
        muted: "#64748b",
        dark: "#0f172a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(0,0,0,0.04)",
        modal: "0 24px 64px 0 rgba(0,0,0,0.18)",
        panel: "0 8px 32px 0 rgba(0,0,0,0.10)",
        glass: "0 8px 32px 0 rgba(31,38,135,0.18)",
      },
      backdropBlur: { xs: "2px" },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
