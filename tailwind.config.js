/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				/** @description 主题色 */
				primary: 'rgb(var(--coss-primary))',

				/** @description 背景色 */
				bgPrimary: 'var(--coss-background-primary)',
				bgSecondary: 'var(--coss-background-secondary)',
				bgTertiary: 'var(--coss-background-tertiary)',

				/** @description 边框 */
				borderPrimary: 'var(--coss-border-primary)',
				borderSecondary: 'var(--coss-border-secondary)',
				borderTertiary: 'var(--coss-border-tertiary)',

				/** @description 文本 */
				textPrimary: 'var(--coss-text-primary)',
				textSecondary: 'var(--coss-text-secondary)',
				textTertiary: 'var(--coss-text-tertiary)',

				/** @description 阴影 */
				shadowPrimary: 'var(--coss-shadow-primary)'
			}
		}
	},
	plugins: []
}
