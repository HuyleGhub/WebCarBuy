import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";


module.exports = withUt({
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'autoslide': 'autoslide 15s infinite ',
  			'fadeleft': 'fadeleft 1s linear',
  			'faderight': 'faderight 3s linear',
  			'fadetop': 'fadetop 0.5s linear',
  			'fadebottom': 'fadebottom 0.5s linear',
  			'bigsize': 'bigsize 0.5s linear',
  			'appear': 'appear linear',
  			'appeartop': 'appeartop linear',
  			'appearright': 'appearright linear',
  			'appearbottom': 'appearbottom linear',
  			'borderrun': 'borderrun 2s linear infinite',
  			'spinrun': 'spinrun 2s linear infinite',
  			'fadeleftdashboard': 'fadeleftdashboard 3s linear',
			'loop-scroll': 'loop-scroll 5s linear infinite',
  		},
  		keyframes: {
  			autoslide: {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'25%': {
  					transform: 'translateX(0)'
  				},
  				'30%': {
  					transform: 'translateX(-100%)'
  				},
  				'50%': {
  					transform: 'translateX(-100%)'
  				},
  				'55%': {
  					transform: 'translateX(-200%)'
  				},
  				'75%': {
  					transform: 'translateX(-200%)'
  				},
  				'80%': {
  					transform: 'translateX(-300%)'
  				},
  				'100%': {
  					transform: 'translateX(-300%)'
  				}
  			},
  			fadeleft: {
  				'0%': {
  					transform: 'translateX(-40%)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'translateX(-30%)',
  					opacity: '0.5'
  				},
  				'60%': {
  					transform: 'translateX(-25%)',
  					opacity: '0.6'
  				},
  				'80%': {
  					transform: 'translateX(-10%)',
  					opacity: '0.8'
  				},
  				'100%': {
  					transform: 'scale(1.5)',
  					opacity: '1'
  				}
  			},
  			appear: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-150px)'
  				},
  				'50%': {
  					opacity: '0.5',
  					transform: 'translateX(-50px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0px)'
  				}
  			},
  			appearright: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(150px)'
  				},
  				'50%': {
  					opacity: '0.5',
  					transform: 'translateX(50px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0px)'
  				}
  			},
  			appeartop: {
  				'0%': {
  					opacity: '0',
  					scale: '0.3'
  				},
  				'50%': {
  					opacity: '0.5',
  					scale: '0.5'
  				},
  				'100%': {
  					opacity: '1',
  					scale: '1'
  				}
  			},
  			appearbottom: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(100px)'
  				},
  				'50%': {
  					opacity: '0.5',
  					transform: 'translateY(40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0px)'
  				}
  			},
  			faderight: {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'translateX(50%)',
  					opacity: '0.5'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			fadetop: {
  				'0%': {
  					transform: 'translateY(-50%)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'translateY(-20%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			fadeleftdashboard: {
  				'0%': {
  					transform: 'translateX(-50%)'
  				},
  				'50%': {
  					transform: 'translateX(-20%)'
  				},
  				'100%': {
  					transform: 'translateY(0)'
  				}
  			},
  			fadebottom: {
  				'0%': {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'translateY(50%)',
  					opacity: '0.5'
  				},
  				'100%': {
  					transform: 'translateY(-100%)',
  					opacity: '1'
  				}
  			},
  			bigsize: {
  				'0%': {
  					transform: 'translatex(0)',
  					scale: '0.5'
  				},
  				'50%': {
  					transform: 'translateY(50%)',
  					scale: '0.75'
  				},
  				'100%': {
  					transform: 'translateY(-100%)',
  					scale: '1'
  				}
  			},
  			borderrun: {
  				'0%, 100%': {
  					boxShadow: '0 0 15px 15px rgba(255, 66, 0, 0.8)'
  				},
  				'50%': {
  					boxShadow: '0 0 5px 5px rgba(222, 97, 53, 0.8)'
  				}
  			},
  			spinrun: {
  				'0%, 100%': {
  					clipPath: 'inset(0 0 98% 0)'
  				},
  				'25%': {
  					clipPath: 'inset(0 98% 0 0)'
  				},
  				'50%': {
  					clipPath: 'inset(98% 0 0 0)'
  				},
  				'75%': {
  					clipPath: 'inset(0 0 0 98%)'
  				}
  			},
			"loop-scroll": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0%)" },
         },
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  daisyui: {
    themes: ["light", "dark"],
    
  },
  
  plugins: [require('daisyui'), require("tailwindcss-animate")],
});

