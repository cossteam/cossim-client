import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { classToString, stringToClass } from '@/utils/utils'

const signalStore = (set, get) => ({
	// 信令
	signal: null,
	// 仓库
	state: null,
	updateSignal: (signal) => {
		const newSignal = classToString(signal)
		set({ signal: newSignal })
	},
	getSignal: () => {
		const { signal } = get()
		return stringToClass(signal)
	},
	updateState: (data) => {
		set((state) => ({
			state: { ...state.state, ...data }
		}))
	}
})

const ProStroeName = 'COSS_PRO_SIGNAL_STRORAGE'
const DevStroeName = 'COSS_DEV_SIGNAL_STRORAGE'
export const storageName = import.meta.env.MODE === 'development' ? DevStroeName : ProStroeName

export const useSignalStore = create(
	devtools(
		persist(signalStore, {
			name: storageName,
			storage: createJSONStorage(() => localStorage)
		})
	)
)
