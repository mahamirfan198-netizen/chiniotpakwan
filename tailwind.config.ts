import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: "#123B2A",
          light: "#1E5C42",
          soft: "#E8F0EA",
        },
        gold: {
          antique: "#C6A15B",
          light: "#D9BE85",
          dark: "#A88545",
        },
        ivory: {
          DEFAULT: "#FAF6EE",
          warm: "#F5EFE2",
        },
        charcoal: {
          DEFAULT: "#242521",
          soft: "#4A4B47",
        },
        terracotta: {
          DEFAULT: "#A64B32",
          light: "#C1664D",
        },
        cream: "#FFFBF5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(18, 59, 42, 0.08)",
        luxe: "0 12px 40px -12px rgba(18, 59, 42, 0.15)",
        gold: "0 8px 30px -8px rgba(198, 161, 91, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;