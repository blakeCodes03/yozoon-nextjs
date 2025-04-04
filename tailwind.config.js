// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  darkMode: ['class', 'class'], // Enables dark mode via a CSS class
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			bg1: '#181A20',
  			bg2: '#0B0E11',
  			BasicBg: '#181A20',
  			SecondaryBg: '#0B0E11',
  			line: '#2B3139',
  			bg3: '#2B3139',
  			bg4: '#5E6673',
  			bg6: '#202630',
  			textGray: '#EAECEF',
  			textPrimary: '#EAECEF',
  			textSecondary: '#B7BDC6',
  			textThird: '#848E9C',
  			textDisabled: '#5E6673',
  			accentGreen: '#10A37F',
  			accentBlue: '#1F6FEB',
  			neonBlue: '#2323ff',
  			divider: '#2B3139',
  			btnPrimaryBg: '#2323ff',
  			btnPrimaryText: '#FFFFFF',
  			btnSecondaryBg: '#3C3D3E',
  			btnSecondaryText: '#E8E8E9',
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
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		opacity: {
  			'10': '0.1',
  			'20': '0.2',
  			'30': '0.3',
  			'40': '0.4',
  			'50': '0.5',
  			'60': '0.6',
  			'70': '0.7',
  			'80': '0.8',
  			'90': '0.9'
  		},
  		boxShadow: {
  			shadow1: '0 1px 3px rgba(0, 0, 0, 0.1)',
  			shadow2: '0 4px 6px rgba(0, 0, 0, 0.1)'
  		},
  		keyframes: {
  			shake: {
  				'0%': {
  					transform: 'translate(1px, 1px) rotate(0deg)'
  				},
  				'10%': {
  					transform: 'translate(-1px, -2px) rotate(-1deg)'
  				},
  				'20%': {
  					transform: 'translate(-3px, 0px) rotate(1deg)'
  				},
  				'30%': {
  					transform: 'translate(3px, 2px) rotate(0deg)'
  				},
  				'40%': {
  					transform: 'translate(1px, -1px) rotate(1deg)'
  				},
  				'50%': {
  					transform: 'translate(-1px, 2px) rotate(-1deg)'
  				},
  				'60%': {
  					transform: 'translate(-3px, 1px) rotate(0deg)'
  				},
  				'70%': {
  					transform: 'translate(3px, 1px) rotate(-1deg)'
  				},
  				'80%': {
  					transform: 'translate(-1px, -1px) rotate(1deg)'
  				},
  				'90%': {
  					transform: 'translate(1px, 2px) rotate(0deg)'
  				},
  				'100%': {
  					transform: 'translate(1px, -2px) rotate(-1deg)'
  				}
  			},
  			shakeOnce: {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'25%': {
  					transform: 'translateX(-10px)'
  				},
  				'50%': {
  					transform: 'translateX(10px)'
  				},
  				'75%': {
  					transform: 'translateX(-10px)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			shake: 'shake 0.5s ease-in-out',
  			shakeOnce: 'shakeOnce 0.5s ease-in-out',
  			shakeInfinite: 'shake 2s infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
});
