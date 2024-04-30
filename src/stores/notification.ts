import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface StoreOptions {
	enableNotification: boolean
	showDetail: boolean
}

type Store = StoreOptions & {
	update: (options: Partial<StoreOptions>) => void
}

export const defaultOptions: StoreOptions = {
	enableNotification: true,
	showDetail: true
}

const userStore = (set: any): Store => ({
	...defaultOptions,
	update: (options) => set((state: Store) => ({ ...state, ...options }))
})

const useNotificationStore = create(
	devtools(
		persist(userStore, {
			name: 'coss-notification-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useNotificationStore
