import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const liveStore = (set) => ({
	liveStatus: -1, // -1->非通话状态 14->用户来电 16->用户通话拒绝 15->群聊来电 17-> 群聊通话拒绝
	updateLiveStatus: (status) => set({ liveStatus: status }),
	isBack: false, // 是否后台通话
	updateBack: (isBack) => set({ isBack }),
	live: null,
	updateLive: (live) => set({ live })
})

export const useLiveStore = create(
	devtools(
		persist(liveStore, {
			name: 'liveStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
