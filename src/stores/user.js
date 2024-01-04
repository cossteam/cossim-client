import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

// const storeFn = (set, get) => ({
// 	user: {},
// 	userInfo: {},
// 	updateUser: (user) =>
// 		set((state) => ({
// 			user: {
// 				...state.user,
// 				...user
// 			}
// 		})),
// 	removeUser: () => set({ user: {}, userInfo: {} })
// updateUserInfo: async ()=>{
// 	const {user} = get()
// 	const userInfo = await getUserInfoApi({username: user.name})
// 	set({userInfo})
//   }
// })

const userStore = (set) => ({
	isLogin: false,
	token: '',
	user: {},
	updateLogin: (isLogin) => set({ isLogin }),
	updateUser: (user) =>
		set((state) => ({
			user: {
				...state.user,
				...user
			}
		})),
	removeUser: () => set({ user: {}, isLogin: false }),
	updateToken: (token) => set({ token })
})

export const useUserStore = create(
	devtools(
		persist(userStore, {
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage)
		}),
		{
			// eslint-disable-next-line no-undef
			enabled: process.env.NODE_ENV === 'development',
			name: 'coss-storage'
		}
	)
)
