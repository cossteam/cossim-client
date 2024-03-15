/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			// mobile
			mobile: { min: '320px', max: '750px' },
			// desktop
			desktop: { min: '751px' }
		},
		extend: {
			colors: {
				/** @description 主题色 */
				primary: 'rgb(--coss-color-primary)',

				/** @description 背景色 */
				bgPrimary: 'var(--coss-bg-primary)',
				bgSecondary: 'var(--coss-bg-secondary)',
				bgTertiary: 'var(--coss-bg-tertiary)',

				/** @description 文本 */
				textPrimary: 'var(--coss-text-primary)',
				textSecondary: 'var(--coss-text-secondary)',
				textTertiary: 'var(--coss-text-tertiary)',
			}
		}
	},
	plugins: [],
	corePlugins: {
		preflight: false
	}
}
