import { SocketEvent } from '@/shared'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface LiveParams {
	/** 是否群聊 */
	isGroup: boolean
	/** 隐藏房间 */
	hideRoom: boolean
	/** 通话状态 */
	calling: boolean
}

interface LiveFunc {
	/** 更新隐藏房间 */
	updateHideRoom: (hideRoom: boolean) => void

	/** 更新通话状态 */
	updateCalling: (calling: boolean) => void

	/** 处理事件 */
	handlerEvent: (event: SocketEvent, eventDate: any) => void

	/** 创建房间 */
	createRoom: () => void

	/** 加入房间 */
	joinRoom: () => void

	/** 拒绝加入 */
	rejectRoom: () => void

	/** 离开房间 */
	leaveRoom: () => void
}

type LiveStore = LiveParams & LiveFunc

const initialParams = (): LiveParams => ({
	isGroup: false,
	hideRoom: true,
	calling: false
})

// export const liveStore = (set: any, get: () => LiveStore): LiveStore => ({
// export const liveStore = (): LiveStore => ({
export const liveStore = (set: any): LiveStore => ({
	...initialParams(),
	updateHideRoom: (calling) => {
		set({
			calling
		})
	},
	updateCalling: () => {},
	handlerEvent: (event: SocketEvent, eventDate: any) => {
		console.log('通话监听', event, eventDate)
	},
	createRoom: async () => {},
	joinRoom: () => {},
	rejectRoom: () => {},
	leaveRoom: () => {}
})

export const useLiveStore = create(
	devtools(
		persist(liveStore, {
			name: 'liveStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
