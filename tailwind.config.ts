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
        "custom-lime": "#bcec30",
      },
      borderRadius: {
        "3xl": "30px",
        "5xl": "50px",
      },
      spacing: {
        "6px": "6px",
        "11px": "11px",
        '20px': '20px',
      },
      lineHeight: {
        "110": "110%",
      },
      backgroundColor: {
        'custom-gray': 'rgb(247, 247, 247)',
      },
      width: {
        '360': '360px',
      },
    },
  },
  plugins: [],
};
export default config;
