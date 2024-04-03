import { create } from 'zustand'
import { UserStore, UserStoreOptions } from './type'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

export const defaultOptions: UserStoreOptions = {
	userId: '',
	userInfo: null,
	token: '',
	deviceId: ''
}

const userStore = (set: any): UserStore => ({
	...defaultOptions,
	update: (options) => set((state: UserStore) => ({ ...state, ...options }))
})

const useUserStore = create(
	devtools(
		persist(userStore, {
			name: 'coss-user-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useUserStore
