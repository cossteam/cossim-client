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
    serviceKey: '',
    clientKeys: {},
	updateLogin: (isLogin) => set({ isLogin }),
	updateUser: (user) =>
		set((state) => ({
			user: {
				...state.user,
				...user
			}
		})),
	removeUser: () => set({ user: {}, isLogin: false }),
	updateToken: (token) => set({ token }),
    updateServiceKey: (serviceKey) => set({ serviceKey }),
	updateClientKeys: (clientKeys) =>
        set((state) => ({
            clientKeys: {
				...state.clientKeys,
				...clientKeys
			}
        }))
})

const ProStroeName = 'COSS_USER_STRORAGE'
const DevStroeName = 'COSS_DEV_STRORAGE'
export const storageName = import.meta.env.MODE === 'development' ? DevStroeName : ProStroeName

export const useUserStore = create(
	devtools(
		persist(userStore, {
			name: storageName,
			storage: createJSONStorage(() => localStorage)
		})
		// {
		// 	enabled: import.meta.env.MODE === 'development',
		// 	name: DevStroeName
		// }
	)
)
