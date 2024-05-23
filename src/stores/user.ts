import { create } from 'zustand'
import { UserOptions, UserStoreMethods, UserStore } from '@/types/store'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

const states: UserOptions = {
	userId: '',
	userInfo: '',
	token: ''
}

const actions = (set: any): UserStoreMethods => ({
	update: async (options) => set(options)
})

const commonStore = (set: any): UserStore => ({
	...states,
	...actions(set)
})

const useUserStore = create(
	devtools(
		persist(commonStore, {
			name: 'COSS_USER_STORE',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useUserStore
