import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const relationRequestStore = (set) => ({
	friendResquest: [],
	groupResquest: [],
	updateFriendResquest: (friendResquest) => set({ friendResquest }),
	updateGroupResquest: (groupResquest) => set({ groupResquest })
})

export const useRelationRequestStore = create(
	devtools(
		persist(relationRequestStore, {
			name: 'relationRequestStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
