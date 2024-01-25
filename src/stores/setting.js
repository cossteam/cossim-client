import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const settingStore = (set) => ({})

export const useSettingStore = create(
	devtools(
		persist(settingStore, {
			name: 'COSS_SETTINGSTORE',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
