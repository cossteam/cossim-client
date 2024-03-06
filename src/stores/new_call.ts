import { CallStatus } from '@/pages/Call/enums'
import { CallOption } from '@/pages/Call/types'
import { SocketEvent } from '@/shared'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { hasCamera } from '@/utils/media'
import { f7 } from 'framework7-react'
// import CallService from '@/api/call'

interface Room {
	id: string | number
	isGroup: boolean
	member?: Array<string>
	option?: CallOption
	url: string
	token: string
}

interface newCallStore {
	// 是否可见
	visible: boolean
	// updateVisible: (visible: boolean) => void
	// 通话状态
	status: CallStatus
	// updateStatus: (status: CallStatus) => void
	// 房间信息
	room: Room | null
	// 处理通话事件
	handlerCallEvent: (event: SocketEvent, data: any) => void
	// 创建房间
	createRoom: (id: string | number, option?: CallOption, isGroup?: boolean, member?: Array<string>) => void
	// 加入房间
	joinRoom: (id: string | number, option?: CallOption) => void
	// 离开房间
	leaveRoom: (id: string | number) => void
	// 拒绝加入房间
	refuseJoinRoom: (id: string | number) => void
}

export const callStore = (set: any): newCallStore => ({
	// 是否可见
	visible: false,
	// updateVisible: (visible) => {
	// 	set({ visible })
	// },
	// 通话状态
	status: CallStatus.IDLE,
	// updateStatus: (status: CallStatus) => {
	// 	set({ status })
	// },
	// 房间信息
	room: null,
	// 处理通话事件
	handlerCallEvent: (event: SocketEvent, data: any) => {
		console.log('处理通话事件', event, data)
		switch (event) {
			case SocketEvent.UserCallReqEvent: // 用户来电
			case SocketEvent.GroupCallReqEvent: // 群聊来电
				set({ status: CallStatus.WAITING })
				break
			case SocketEvent.UserCallRejectEvent: // 用户拒绝
			case SocketEvent.GroupCallRejectEvent: // 群聊拒绝
				set({ status: CallStatus.REFUSE })
				break
			case SocketEvent.UserCallHangupEvent: // 用户挂断
			case SocketEvent.GroupCallHangupEvent: // 群聊挂断
				set({ status: CallStatus.REFUSE })
				break
		}
	},
	// 创建房间
	createRoom: async (id: string | number, option?: CallOption, isGroup?: boolean, member?: Array<string>) => {
		console.log('createRoom', id, member, option)
		try {
			option?.video_enabled && (await hasCamera())
			set({
				room: {
					id,
					isGroup,
					member,
					option
				},
				status: CallStatus.WAITING
			})
		} catch {
			f7.dialog.alert('请检查摄像头权限')
		}
	},
	// 加入房间
	joinRoom: (id: string | number, option?: CallOption) => {
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
