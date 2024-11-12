import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lightbg: "#f5f5f5",
        lightPrimary: "#e2e0e0",
        lightHover: "#D1D5DB",
        darkbg: "#020305",
        darkPrimary: "#1d1c1c",
        darkHover: "#262c36",
      },
    },
  },
  plugins: [],
};
export default config;
