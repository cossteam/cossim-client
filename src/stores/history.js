import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const historyStore = (set) => ({
	account: [],
	updateChats: (user) =>
		set((state) => ({
			...state.account,
			user
		}))
})

export const useHistoryStore = create(
	devtools(
		persist(historyStore, {
			name: 'ACCOUNT_HISTORY',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
