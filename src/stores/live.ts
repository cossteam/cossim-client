import CallService from '@/api/call'
import { SocketEvent } from '@/shared'
import { CreateRoomOption, RoomConnectionInfo } from '@/types/live'
import { f7 } from 'framework7-react'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface LiveParams {
	/** 是否群聊 */
	isGroup: boolean
	/** 隐藏房间 */
	hideRoom: boolean
	/** 通话状态 */
	calling: boolean
	/** 是否视频 */
	isVideo: boolean
	/** 接收者 */
	recipient: ''
	/** 房间号 */
	room: ''
	/** token */
	token: string
	/** 房间地址 */
	url: string
}

interface LiveFunc {
	/** 重置状态 */
	reset: () => void

	/** 更新隐藏房间 */
	updateHideRoom: (hideRoom: boolean) => void

	/** 更新通话状态 */
	updateCalling: (calling: boolean) => void

	/** 处理事件 */
	handlerEvent: (event: SocketEvent, eventDate: any) => void

	/** 创建房间 */
	createRoom: (createRoomOption: CreateRoomOption) => void

	/** 加入房间 */
	joinRoom: () => Promise<RoomConnectionInfo>

	/** 拒绝加入 */
	rejectRoom: () => void

	/** 离开房间 */
	leaveRoom: () => void
}

type LiveStore = LiveParams & LiveFunc

const initialParams = (): LiveParams => ({
	hideRoom: true, // 隐藏房间
	calling: false, // 加入房间以后为通话中
	isGroup: false, // 是否群聊
	isVideo: false, // 是否视频通话否则是语音通话
	recipient: '',
	room: '',
	token: '', // token
	url: '' // 房间地址
})

// export const liveStore = (): LiveStore => ({
export const liveStore = (set: any, get: () => LiveStore): LiveStore => ({
	// export const liveStore = (set: any): LiveStore => ({
	...initialParams(),
	reset: () => {
		set({ ...initialParams() })
	},
	updateHideRoom: (hideRoom) => {
		set({
			hideRoom
		})
	},
	updateCalling: (calling) => {
		set({
			calling
		})
	},
	handlerEvent: (event: SocketEvent, eventDate: any) => {
		console.log('通话事件监听', event, eventDate)
		const { reset } = get()
		switch (event) {
			case SocketEvent.UserCallReqEvent:
			case SocketEvent.GroupCallReqEvent:
				{
					const isGroup = event === SocketEvent.GroupCallReqEvent
					const isVideo = eventDate?.data?.option?.video_enabled ?? false
					console.log(`${isGroup ? '群聊' : '私聊'}${isVideo ? '视频通话' : '语音通话'}`)
					set({
						isGroup,
						isVideo,
						recipient: eventDate?.data?.sender_id,
						room: eventDate?.data?.room,
						hideRoom: false
					})
				}
				break
			case SocketEvent.UserCallRejectEvent:
			case SocketEvent.GroupCallRejectEvent:
			case SocketEvent.UserCallHangupEvent:
			case SocketEvent.GroupCallHangupEvent:
				{
					reset()
				}
				break
		}
	},
	createRoom: async (
		createRoomOption = { isGroup: false, recipient: '', members: [], audio: true, video: false }
	) => {
		// 显示通话界面
		set({
			isGroup: createRoomOption.isGroup,
			isVideo: createRoomOption.video,
			hideRoom: false
		})
		try {
			const { joinRoom } = get()
			// 创建通话参数
			const createRoomParams: any = {}
			if (!createRoomOption.isGroup) {
				createRoomParams['user_id'] = createRoomOption.recipient
				createRoomParams['member'] = [createRoomOption.recipient]
			} else {
				createRoomParams['group_id'] = Number(createRoomOption.recipient)
				createRoomParams['member'] =
					createRoomOption.members
						?.map((item: any) => item.user_id)
						.filter((item: any) => item !== undefined) || []
			}
			createRoomParams['type'] = createRoomOption.isGroup ? 'group' : 'user'
			createRoomParams['option'] = {
				audio_enabled: createRoomOption.audio,
				video_enabled: createRoomOption.video
				// codec: 'vp8',
				// frame_rate: 0,
				// resolution: '1280x720'
			}
			// 创建通话
			const { code, data, msg } = await CallService.createLiveApi(createRoomParams)
			if (code !== 200) {
				f7.dialog.alert(msg)
				return
			}
			console.log('房间信息', data)
			set({
				room: data.room,
				recipient: createRoomOption.recipient
			})
			await joinRoom()
		} catch (error: any) {
			f7.dialog.alert(error.message)
		}
	},
	joinRoom: async () => {
		const { room, recipient, isGroup } = get()
		const joinRoomParams: any = {}
		if (isGroup) {
			joinRoomParams['group_id'] = Number(recipient)
		} else {
			joinRoomParams['user_id'] = recipient
		}
		joinRoomParams['room'] = room
		try {
			const { code, data, msg } = await CallService.joinLiveApi(joinRoomParams)
			if (code !== 200) {
				f7.dialog.alert(msg)
				return
			}
			console.log('加入房间', data)
			set({
				url: data.url,
				token: data.token,
				calling: true
			})
			return data
		} catch (error: any) {
			f7.dialog.alert(error.message)
		}
	},
	rejectRoom: async () => {
		const { room, recipient, isGroup, reset } = get()
		const refuseRoomParams: any = {}
		!isGroup && (refuseRoomParams['user_id'] = recipient)
		isGroup && (refuseRoomParams['group_id'] = Number(recipient))
		refuseRoomParams['room'] = room
		try {
			await CallService.rejectLiveApi(refuseRoomParams)
		} finally {
			setTimeout(() => {
				reset()
			}, 1000)
		}
	},
	leaveRoom: async () => {
		const { room, recipient, isGroup, reset } = get()
		const createRoomParams: any = {}
		!isGroup && (createRoomParams['user_id'] = recipient)
		isGroup && (createRoomParams['group_id'] = Number(recipient))
		createRoomParams['room'] = room
		try {
			await CallService.leaveLiveApi(createRoomParams)
		} finally {
			setTimeout(() => {
				reset()
			}, 1000)
		}
	}
})

export const useLiveStore = create(
	devtools(
		persist(liveStore, {
			name: 'liveStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
