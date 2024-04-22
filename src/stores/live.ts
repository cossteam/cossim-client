import { SocketEvent } from '@/shared'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import CallService from '@/api/call'
import { f7 } from 'framework7-react'

export enum OwnEventEnum {
	/** 空闲 */
	IDLE,
	/** 等待中 */
	WAITING,
	/** 被邀请 */
	INVITED,
	/** 拒绝 */
	REFUSE,
	/** 被拒绝 */
	REFUSED,
	/** 通话中 */
	BUSY,
	/** 挂断 */
	HANGUP,
	/** 被挂断 */
	HANGED
}

interface LiveStoreParams {
	/** ID */
	id: string | number | null
	/** 是否显示通话界面 */
	opened: boolean
	/** 是否群聊 */
	isGroup: boolean
	/** 成员 */
	members: Array<any>
	/** 服务器地址 */
	serverUrl: string | null
	/** 令牌 */
	token: string | null
	/** 开启麦克风 */
	audio: boolean
	/** 开启摄像头 */
	video: boolean
	/** 事件数据 */
	eventDate: any
	/** 通话事件 */
	ownEvent: OwnEventEnum
}

interface LiveStoreFunc {
	/** 呼叫 */
	call: (callProps: CallProps) => void
	/** 拒绝接通 */
	refuse: () => void
	refused: () => void
	/** 接通电话 */
	accept: () => void
	/** 挂断电话 */
	hangup: () => void
	hanged: () => void
	/** 更新通话界面显示状态 */
	updateOpened: (opened: boolean) => void
	configMedia: (config: { audio?: boolean; video?: boolean }) => void
	/** 更新事件及事件数据 */
	updateEvent: (event: SocketEvent, eventDate: any) => void
	/** 事件描述 */
	ownEventDesc: (event: OwnEventEnum) => string
}

type LiveStore = LiveStoreParams & LiveStoreFunc

export interface CallProps {
	id: string | number
	/** 是否群聊 */
	isGroup: boolean
	/** 成员 */
	members?: Array<any>
	/** 开启麦克风 */
	audio?: boolean
	/** 开启摄像头 */
	video?: boolean
}

/** 初始状态 */
const initialState = (): LiveStoreParams => ({
	opened: false,
	id: null,
	isGroup: false,
	members: [],
	serverUrl: null,
	token: null,
	audio: true,
	video: false,
	eventDate: null,
	ownEvent: OwnEventEnum.IDLE
})

export const liveStore = (set: any, get: any): LiveStore => ({
	...initialState(),
	call: async (callProps: CallProps) => {
		const { accept, hangup } = get()
		const status: CallProps = {
			id: callProps.id,
			isGroup: callProps.isGroup
		}
		if (callProps.isGroup && callProps.members) {
			status['members'] = callProps.members
		}
		callProps.audio && (status['audio'] = callProps.audio)
		callProps.video && (status['video'] = callProps.video)
		// 创建通话参数
		const createRoomParams: any = {}
		!callProps.isGroup && (createRoomParams['user_id'] = callProps.id)
		callProps.isGroup && (createRoomParams['group_id'] = Number(callProps.id))
		callProps.isGroup && (createRoomParams['member'] = callProps.members?.map((item) => item.user_id) || [])
		createRoomParams['option'] = {
			// audio_enabled: true,
			// codec: 'vp8',
			// frame_rate: 0,
			// resolution: '1280x720',
			video_enabled: callProps.video
		}
		try {
			// f7.dialog.preloader('正在呼叫...')
			// // 创建通话
			// const { code, msg } = !callProps.isGroup
			// 	? await CallService.createLiveApi({ data: createRoomParams })
			// 	: await CallService.createLiveGroupApi(createRoomParams)
			// if (code !== 200) {
			// 	f7.dialog.alert(msg, () => {
			// 		hangup()
			// 	})
			// 	return
			// }
			// set({
			// 	...initialState(),
			// 	...status,
			// 	opened: true,
			// 	ownEvent: OwnEventEnum.WAITING // 等待创建房间以及加入房间
			// })
			// 加入房间
			await accept()
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	},
	refuse: async () => {
		set({
			ownEvent: OwnEventEnum.REFUSE
		})
		const { id, isGroup } = get()
		const refuseRoomParams: any = {}
		!isGroup && (refuseRoomParams['user_id'] = id)
		isGroup && (refuseRoomParams['group_id'] = Number(id))
		// try {
		// 	!isGroup
		// 		? await CallService.rejectLiveUserApi(refuseRoomParams)
		// 		: await CallService.rejectLiveUserApi(refuseRoomParams)
		// } finally {
		// 	setTimeout(() => {
		// 		f7.dialog.close()
		// 		set({
		// 			...initialState(),
		// 			ownEvent: OwnEventEnum.IDLE
		// 		})
		// 	}, 2000)
		// }
	},
	refused: () => {
		set({
			ownEvent: OwnEventEnum.REFUSED
		})
		setTimeout(() => {
			f7.dialog.close()
			set({
				...initialState()
			})
		}, 2000)
	},
	accept: async () => {
		const { id, isGroup, hangup } = get()
		const joinRoomParams: any = {}
		!isGroup && (joinRoomParams['user_id'] = id)
		isGroup && (joinRoomParams['group_id'] = Number(id))
		try {
			f7.dialog.preloader('连接中...')
			// const { code, data, msg } = !isGroup
			// ? await CallService.joinLiveUserApi(joinRoomParams)
			// : await CallService.joinLiveGroupApi(joinRoomParams)
			// if (code !== 200) {
			// 	f7.dialog.alert(msg, () => {
			// 		hangup()
			// 	})
			// 	return
			// }
			// console.log('data', data)

			// set({
			// 	serverUrl: data.url,
			// 	token: data.token,
			// 	ownEvent: OwnEventEnum.BUSY
			// })
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	},
	hangup: async () => {
		set({
			ownEvent: OwnEventEnum.HANGUP
		})
		const { id, isGroup, hanged } = get()
		const createRoomParams: any = {}
		!isGroup && (createRoomParams['user_id'] = id)
		isGroup && (createRoomParams['group_id'] = Number(id))
		// try {
		// 	!isGroup
		// 		? await CallService.leaveLiveApi(createRoomParams)
		// 		: await CallService.leaveLiveGroupApi(createRoomParams)
		// } catch {
		// 	hanged()
		// } finally {
		// 	setTimeout(() => {
		// 		f7.dialog.close()
		// 		set({
		// 			...initialState()
		// 		})
		// 	}, 2000)
		// }
	},
	hanged: () => {
		set({
			ownEvent: OwnEventEnum.HANGED
		})
		setTimeout(() => {
			f7.dialog.close()
			set({
				...initialState()
			})
		}, 2000)
	},
	updateOpened: (opened: boolean) => {
		set({ opened })
	},
	configMedia: (config: { audio?: boolean; video?: boolean }) => {
		set({
			audio: config.audio ?? get().audio,
			video: config.video ?? get().video
		})
	},
	updateEvent: (event: SocketEvent, eventDate: any) => {
		let ownEvent = null
		switch (event) {
			case SocketEvent.UserCallReqEvent:
			case SocketEvent.GroupCallReqEvent:
				{
					const isGroup = event === SocketEvent.GroupCallReqEvent
					set({
						id: isGroup ? eventDate.data.group_id : eventDate.data.sender_id,
						isGroup
					})
					ownEvent = OwnEventEnum.INVITED
				}
				break
			case SocketEvent.UserCallRejectEvent:
			case SocketEvent.GroupCallRejectEvent:
				ownEvent = OwnEventEnum.REFUSED
				break
			case SocketEvent.UserCallHangupEvent:
			case SocketEvent.GroupCallHangupEvent:
				ownEvent = OwnEventEnum.HANGED
				break
			default:
				return
		}
		set({ ownEvent, eventDate })
	},
	ownEventDesc: (event: OwnEventEnum): string => {
		switch (event) {
			case OwnEventEnum.IDLE:
				return '空闲'
			case OwnEventEnum.WAITING:
				return '等待中'
			case OwnEventEnum.INVITED:
				return '被邀请'
			case OwnEventEnum.REFUSE:
				return '已拒绝'
			case OwnEventEnum.REFUSED:
				return '被拒绝'
			case OwnEventEnum.BUSY:
				return '通话中'
			case OwnEventEnum.HANGUP:
				return '已挂断'
			case OwnEventEnum.HANGED:
				return '被挂断'
			default:
				return ''
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
