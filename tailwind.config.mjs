/** @type {import('tailwindcss').Config} */
import animations from "@midudev/tailwind-animations";
import { extend } from "leaflet";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [animations],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend:{
 colors: {
    	"_comment": "Los buttons tienen este color: bg-[conic-gradient(from_90deg_at_50%_50%,#b6f55f_0%,#96e53b_50%,#b6f55f_100%)]",
    	primary: "#B9FF66",
    	black: "#000000",
    	white: "#FFFFFF",
    	gray: "#0D0C22",
    	stone: "#231F20",
    	lime: "#B9FF66",
    	zinc: {
    	  100: "#F3F3F3",
    	  200: "#F0F0F0",
    	  300: "#D9D9D9",
    	  400: "#D8D8D8",
    	  500: "#898989",
    	  600: "#B0B0B0",
    	  700: "#787878",
    	  800: "#292A32",
    	  900: "#191A23",
    	},
      },
    },
    boxShadow: {
      card: "0px 5px 0px 0px #191A23",
    },
    extend: {
      fontFamily: {
        SpaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
};
