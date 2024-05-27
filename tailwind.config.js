/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			// mobile
			w750: '750px'
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				background: 'hsl(var(--background))',
				primary: {
					DEFAULT: 'hsl(var(--primary))'
				},
				'background-hover': 'hsl(var(--background-hover))',
				background2: 'hsl(var(--background2))',
				gradient: 'var(--gradient)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				custom: '0px 5px 20px 0px rgba(0, 0, 0, 0.1)'
			}
		}
	},
	plugins: [],
	corePlugins: {
		preflight: false
	}
}
