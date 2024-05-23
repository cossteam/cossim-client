import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { initialState } from './state'
import { storeActions } from './action'
// import { CommonStore } from '@/types/store'

const useCommonStore = create(
	devtools(
		persist(
			(set, get) => ({
				...initialState,
				...storeActions(set, get as any)
			}),
			{
				name: 'COMMON_STORE',
				storage: createJSONStorage(() => localStorage)
			}
		)
	)
)

export { useCommonStore }
