/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}', './src/*.{js,ts,jsx,tsx,html}'],
	theme: {
		extend: {
			colors: {
				/** @description: 主题色 */
				primary: 'var(--color-primary)',
				/** @description: icon 颜色 */
				icon: {
					33: 'var(--color-33)',
					cc: 'var(--color-cc)',
					60: 'var(--color-60)',
					90: 'var(--color-90)'
				}
			}
		}
	},
	plugins: []
}
