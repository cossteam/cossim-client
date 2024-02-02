import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const liveStore = (set) => ({
	live: null,
	updateLive: (live) => set({ live })
})

export const useLiveStore = create(
	devtools(
		persist(liveStore, {
			name: 'liveStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
