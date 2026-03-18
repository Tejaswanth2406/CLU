/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", "ui-sans-serif", "system-ui"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dce6ff",
          200: "#b9ccff",
          500: "#4f72f5",
          600: "#3352d4",
          700: "#2440b3",
          900: "#0d1f6b",
        },
        danger: {
          50: "#FCEBEB",
          100: "#F7C1C1",
          400: "#E24B4A",
          600: "#A32D2D",
          800: "#791F1F",
        },
        warning: {
          50: "#FAEEDA",
          100: "#FAC775",
          400: "#BA7517",
          600: "#854F0B",
          800: "#633806",
        },
        success: {
          50: "#EAF3DE",
          100: "#C0DD97",
          400: "#639922",
          600: "#3B6D11",
          800: "#27500A",
        },
        info: {
          50: "#E6F1FB",
          100: "#B5D4F4",
          400: "#378ADD",
          600: "#185FA5",
          800: "#0C447C",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "spin-slow": "spin 1.2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
