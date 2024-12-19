import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef9ec",
          100: "#faefcb",
          200: "#f5dd92",
          300: "#eec048",
          400: "#ecb033",
          500: "#e4911c",
          600: "#ca6e15",
          700: "#a84f15",
          800: "#893d17",
          900: "#713316",
          950: "#401908",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        "light-black": "#1E1E1E",
      },
    },
  },
  plugins: [],
} satisfies Config;
