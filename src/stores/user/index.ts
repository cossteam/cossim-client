import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { initialState } from './state'
import { storeActions } from './action'

const useUserStore = create(
	devtools(
		persist(
			() => ({
				...initialState,
				...storeActions()
			}),
			{
				name: 'USER_STORE',
				storage: createJSONStorage(() => localStorage)
			}
		)
	)
)

export { useUserStore }
