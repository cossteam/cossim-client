import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { liveStatus } from '@/utils/constants'

const liveStore = (set) => ({
	liveInfo: null, // 通话信息
	updateLiveInfo: (liveInfo) => set({ liveInfo }),
	liveStatus: liveStatus.NOT_START, // 通话状态
	updateLiveStatus: (status) => set({ liveStatus: status }),
	isBack: false, // 是否后台通话
	updateBack: (isBack) => set({ isBack })
})

export const useLiveStore = create(
	devtools(
		persist(liveStore, {
			name: 'liveStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
