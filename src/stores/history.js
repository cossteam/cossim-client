import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const historyStore = (set) => ({
	ids: [],
	updateIds: (id) =>
		set((state) => {
			const index = state.ids.findIndex((item) => item === id)
			if (index === -1) {
				return { ids: [...state.ids, id] }
			}
			return { ids: state.ids }
		})
})

export const useHistoryStore = create(
	devtools(
		persist(historyStore, {
			name: 'COSS_ACCOUNT_HISTORY',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
