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

const useCommonStore = create(
	devtools(
		persist(commonStore, {
			name: 'USER_STORE',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useCommonStore
