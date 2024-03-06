import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
// import CallService from '@/api/call'

enum CallStatus {
	// 空闲
	IDLE,
	// 等待
	WAITING,
	// 通话中
	CALL,
	// 挂断
	HANGUP
}

interface Option {
	audio_enabled?: boolean
	codec?: string
	frame_rate?: number
	resolution?: string
	video_enabled?: boolean
}

interface newCallStore {
	// 是否可见
	visible: boolean
	updateVisible: (visible: boolean) => void
	// 通话状态
	status: CallStatus
	// 房间信息
	room: any
	// 创建房间
	createRoom: (id: string | number, member?: Array<string>, option?: Option) => void
	// 加入房间
	joinRoom: (id: string | number, option?: Option) => void
	// 离开房间
	leaveRoom: (id: string | number) => void
	// 拒绝加入房间
	refuseJoinRoom: (id: string | number) => void
}

export const callStore = (set: any): newCallStore => ({
	// 是否可见
	visible: false,
	updateVisible: (visible) => {
		set({ visible })
	},
	// 通话状态
	status: CallStatus.IDLE,
	// 房间信息
	room: null,
	// 创建房间
	createRoom: (id: string | number, member?: Array<string>, option?: Option) => {
		console.log('createRoom', id, member, option)
	},
	// 加入房间
	joinRoom: (id: string | number, option?: Option) => {
		console.log('joinRoom', id, option)
	},
	// 离开房间
	leaveRoom: (id: string | number) => {
		console.log('leaveRoom', id)
	},
	// 拒绝加入房间
	refuseJoinRoom: (id: string | number) => {
		console.log('refuseJoinRoom', id)
	}
})

export const useNewCallStore = create(
	devtools(
		persist(callStore, {
			name: 'newCallStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
