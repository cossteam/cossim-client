import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { UserStore } from './type'

const userStore = (): UserStore => ({
	userId: '',
	userInfo: null,
	token: 'token123'
})

const useUserStore = create(
	devtools(
		persist(userStore, {
			name: '__user_storage__',
			storage: createJSONStorage(() => localStorage)
		})
	)
)

export default useUserStore
