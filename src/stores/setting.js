import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import routes from '@/config/routes'

const settingStore = (set) => ({
	// colors: {
	// 	// '#33a854'
	// 	primary: 'blue'
	// },
	params: {
		name: 'Coss',
		// ios, md, auto
		theme: 'auto',
		routes,
		darkMode: false,
		// 默认主题
		colors: {
			primary: 'blue'
		},
		serviceWorker:
			// eslint-disable-next-line no-undef
			process.env.NODE_ENV === 'production'
				? {
						path: '/service-worker.js'
					}
				: {}
	},
	updateParams: (params) => set((state) => ({ ...state, params }))
})

export const useSettingStore = create(
	devtools(
		persist(settingStore, {
			name: 'settingStore-storage',
			storage: createJSONStorage(() => localStorage)
		}),
		{
			// eslint-disable-next-line no-undef
			enabled: process.env.NODE_ENV === 'development',
			name: 'settingStore-storage'
		}
	)
)
