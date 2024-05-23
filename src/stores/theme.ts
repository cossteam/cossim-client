import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { ThemeStore } from '@/types/store'
import { transformNameToLine } from '@/utils/utils'
// import themeConfig from '@/config/theme'

const themeStore = (set: any, get: any): ThemeStore => ({
	theme: 'light',
	/** 默认基本色 */
	themeOptions: {
		/** 主题色 */
		colorPrimary: '#00b96b',
		/** 圆角 */
		borderRadius: 2,
		/** 背景色 */
		colorBgContainer: '#f6ffed'
	},
	init: async () => {
		const { themeOptions } = get()

		// set({ themeOptions: Object.assign(themeOptions, theme === 'light' ? themeConfig.light : themeConfig.dark) })

		// 生成 css 变量
		const cssVariables = Object.entries(themeOptions).map(([key, value]) => {
			return `--coss-${transformNameToLine(key)}: ${value}`
		})

		// 将 css 变量添加到 style 中的 root 中
		const styleElement = document.createElement('style')
		styleElement.textContent = `:root { ${cssVariables.join(';')} }`
		document.head.appendChild(styleElement)
	}
})

const useThemeStore = create(
	devtools(
		persist(themeStore, {
			name: '__theme_storage__',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useThemeStore
