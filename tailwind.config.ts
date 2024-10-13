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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
          "autoslide": "autoslide 15s infinite ",
          "fadeleft": "fadeleft 1s linear",
          "faderight": "faderight 3s linear",
          "fadetop": "fadetop 0.5s linear",
          "fadebottom": "fadebottom 0.5s linear",
          "bigsize": "bigsize 0.5s linear",
          "appear": "appear linear",
          "appeartop": "appeartop linear",
          "appearright": "appearright linear",
          "appearbottom": "appearbottom linear",
          "borderrun": "borderrun 2s linear infinite",
          "spinrun": 'spinrun 2s linear infinite',
      },
      keyframes: {
        autoslide: {
          '0%': { transform: "translateX(0)" },
          '25%': { transform: "translateX(0)" },
          '30%': { transform: "translateX(-100%)" },
          '50%': { transform: "translateX(-100%)" },
          '55%': { transform: "translateX(-200%)" },
          '75%': { transform: "translateX(-200%)" },
          '80%': { transform: "translateX(-300%)" },
          '100%': { transform: "translateX(-300%)" },
        },
        fadeleft: {
          '0%': { transform: "translateX(-40%)", opacity: "0"},
          '50%': { transform: "translateX(-30%)", opacity:"0.5" },
          '60%': { transform: "translateX(-25%)", opacity : "0.6" },
          '80%': { transform: "translateX(-10%)", opacity: "0.8" },
          '100%': { transform: "scale(1.5)", opacity:"1"}, 
        },
        appear: {
          "0%": { opacity: '0', transform: 'translateX(-150px)' },
          "50%": { opacity: '0.5', transform: 'translateX(-50px)'},
          "100%": { opacity: '1', transform: 'translateX(0px)' },
        },
        appearright: {
          "0%": { opacity: '0', transform: 'translateX(150px)' },
          "50%": { opacity: '0.5', transform: 'translateX(50px)'},
          "100%": { opacity: '1', transform: 'translateX(0px)' },
        },
        appeartop: {
          "0%": { opacity: '0', scale: '0.3' },
          "50%": { opacity: '0.5', scale: '0.5'},
          "100%": { opacity: '1', scale: '1' },
        },
        appearbottom: {
          "0%": { opacity: '0', transform: 'translateY(100px)' },
          "50%": { opacity: '0.5', transform: 'translateY(40px)'},
          "100%": { opacity: '1', transform: 'translateY(0px)' },
        },
        
        faderight: {
          '0%': { transform: "translateX(100%)", opacity: "0"},
          '50%': { transform: "translateX(50%)", opacity:"0.5" },
          '100%': { transform: "translateX(0)", opacity:"1"}, 
        },
        fadetop: {
          '0%': { transform: "translateY(-50%)", opacity: "0"},
          '50%': { transform: "translateY(-20%)", opacity:"0" },
          '100%': { transform: "translateY(0)", opacity:"1"}, 
        },
        fadebottom: {
          '0%': { transform: "translateY(100%)", opacity: "0"},
          '50%': { transform: "translateY(50%)", opacity:"0.5" },
          '100%': { transform: "translateY(-100%)", opacity:"1"}, 
        },
        bigsize: {
          '0%': { transform: "translatex(0)", scale: "0.5"},
          '50%': { transform: "translateY(50%)", scale:"0.75" },
          '100%': { transform: "translateY(-100%)", scale:"1"}, 
        },
        borderrun: {
         '0%, 100%': {
            boxShadow: '0 0 15px 15px rgba(20, 100, 244, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 5px 5px rgba(148, 0, 211, 1)',
          },
        },
        spinrun: {
         '0%, 100%': { clipPath: 'inset(0 0 98% 0)' },
          '25%': { clipPath: 'inset(0 98% 0 0)' },
          '50%': { clipPath: 'inset(98% 0 0 0)' },
          '75%': { clipPath: 'inset(0 0 0 98%)' },
        },
      }
    },
  },
  daisyui: {
    themes: ["light", "dark"],
    
  },
  
  plugins: [require('daisyui'),],
};
export default config;
