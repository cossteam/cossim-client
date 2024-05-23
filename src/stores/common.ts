import { create } from 'zustand'
import { CommonOptions, CommonStoreMethods, CommonStore } from '@/types/store'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { THEME } from '@/utils/enum'
import { defaultLanguage } from '@/i18n'

const states: CommonOptions = {
	theme: THEME.LIGHT,
	themeColor: '#00b96b',
	lang: defaultLanguage
}

const actions = (set: any, get: any): CommonStoreMethods => ({
	init: async () => {
		const options = get()
		console.log('🚀 ~ 当前主题', options.theme)
		// 这里可以做一些初始化操作，比如获取本地存储的用户信息等
	},
	update: async (options) => set(options)
})

const commonStore = (set: any, get: any): CommonStore => ({
	...states,
	...actions(set, get)
})

const useCommonStore = create(
	devtools(
		persist(commonStore, {
			name: 'COSS_COMMON_STORE',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useCommonStore
