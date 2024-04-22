import { f7 } from 'framework7-react'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { SocketEvent } from '@/shared'
import CallService from '@/api/call'

export enum LiveRoomStates {
	/** 空闲 */
	IDLE,
	/** 等待中 */
	WAITING,
	/** 拒绝 */
	REFUSE,
	/** 加入中 */
	JOINING,
	/** 通话中 */
	BUSY,
	/** 挂断 */
	HANGUP,
	/** 连接失败 */
	ERROR,
	/** 被拒绝 */
	REFUSEBYOTHER,
	/** 被挂断 */
	HANGUPBYOTHER,
	/** 超时 */
	TIMEOUT
}

export interface CallProps {
	recipient: string | number
	/** 是否群聊 */
	isGroup: boolean
	/** 成员 */
	members?: Array<any>
	/** 开启摄像头 */
	video?: boolean
}

interface LiveRoomParams {
	room: string | null
	url: string | null
	token: string | null
	recipient: number | string | null
	isGroup: boolean
	members: Array<any>
	video: boolean
	eventDate: any
	state: LiveRoomStates
	opened: boolean
	/** 离开 id 列表 */
	leaveIds: Array<string>
}

interface LiveRoomFunc {
	updateOpened: (opened: boolean) => void
	updateState: (state: LiveRoomStates) => void
	/** 重置状态 */
	resetState: () => void
	getliveRoomStatesText: (state: LiveRoomStates) => string
	handlerEvent: (event: SocketEvent, eventDate: any) => void
	/** 检查 */
	check: (id?: string | null) => void
	/** 呼叫 */
	call: (callProps: CallProps) => void
	/** 挂断通话 */
	hangup: () => void
	/** 拒绝通话 */
	refuse: () => void
	/** 加入通话 */
	join: () => void
}

type LiveRoomStore = LiveRoomParams & LiveRoomFunc

const initialState = (): LiveRoomParams => ({
	room: null,
	url: null,
	token: null,
	video: false,
	eventDate: null,
	recipient: null,
	isGroup: false,
	members: [],
	state: LiveRoomStates.IDLE,
	opened: false,
	leaveIds: []
})

export const liveRoomStore = (set: any, get: () => LiveRoomStore): LiveRoomStore => ({
	...initialState(),
	updateOpened: (opened: boolean) => {
		set({
			opened
		})
	},
	updateState: (state: LiveRoomStates) => {
		set({
			state
		})
	},
	resetState: () => {
		set({
			...initialState()
		})
	},
	getliveRoomStatesText: (state: LiveRoomStates) => {
		switch (state) {
			case LiveRoomStates.IDLE:
				return '空闲'
			case LiveRoomStates.WAITING:
				return '等待中'
			case LiveRoomStates.REFUSE:
				return '拒绝'
			case LiveRoomStates.JOINING:
				return '加入中'
			case LiveRoomStates.BUSY:
				return '通话中'
			case LiveRoomStates.HANGUP:
				return '挂断'
			case LiveRoomStates.ERROR:
				return '连接失败'
			case LiveRoomStates.REFUSEBYOTHER:
				return '已被拒绝'
			case LiveRoomStates.HANGUPBYOTHER:
				return '已被挂断'
			case LiveRoomStates.TIMEOUT:
				return '已超时'
			default:
				return ''
		}
	},
	handlerEvent: (event: SocketEvent, eventDate: any) => {
		console.log('通话事件', event, eventDate)
		const { state, resetState, hangup } = get()
		if (
			state !== LiveRoomStates.IDLE &&
			[SocketEvent.UserCallReqEvent, SocketEvent.GroupCallReqEvent].includes(event)
		) {
			f7.dialog.confirm(
				'你有新的来电，是否结束当前通话并接通?',
				async () => {
					// 确定
					await hangup()
				},
				() => {
					// 取消
					return
				}
			)
		}
		set({
			eventDate,
			video: eventDate?.data?.option?.video_enabled // 是否视频通话
		})
		switch (event) {
			// 来电
			case SocketEvent.UserCallReqEvent:
			case SocketEvent.GroupCallReqEvent:
				{
					const isGroup = event === SocketEvent.GroupCallReqEvent
					const room = eventDate.data.room
					console.log('ws event room => ', room)
					set({
						room: room,
						isGroup,
						recipient: isGroup ? Number(eventDate.data.group_id) : eventDate.data.sender_id,
						state: LiveRoomStates.WAITING,
						opened: true
					})
				}
				break
			// 被拒绝
			case SocketEvent.UserCallRejectEvent:
			case SocketEvent.GroupCallRejectEvent:
				set({
					state: LiveRoomStates.REFUSEBYOTHER
				})
				setTimeout(() => {
					resetState()
				}, 2000)
				break
			// 被挂断
			case SocketEvent.UserCallHangupEvent:
			case SocketEvent.GroupCallHangupEvent:
				set({
					state: LiveRoomStates.HANGUPBYOTHER
				})
				setTimeout(() => {
					resetState()
				}, 2000)
				break
			case SocketEvent.UserLeaveGroupCallEvent:
				// eslint-disable-next-line no-case-declarations
				const { leaveIds } = get()
				set({
					leaveIds: [...leaveIds, eventDate.data.sender_id]
				})
				break
			default:
				return
		}
	},
	check: async (id?: string | null) => {
		console.log(id)
	},
	call: async (callProps: CallProps) => {
		const { join, hangup } = get()
		// 状态
		const status: CallProps = {
			recipient: callProps.recipient,
			isGroup: callProps.isGroup
		}
		// if (callProps.isGroup && callProps.members) {
		if (callProps.members) {
			status['members'] = callProps.members
		}
		callProps.video && (status['video'] = callProps.video)
		// 创建通话参数
		const createRoomParams: any = {}
		if (!callProps.isGroup) {
			createRoomParams['user_id'] = callProps.recipient
			createRoomParams['member'] = [callProps.recipient]
		}
		callProps.isGroup && (createRoomParams['group_id'] = Number(callProps.recipient))
		callProps.isGroup && (createRoomParams['member'] = callProps.members?.map((item) => item.user_id) || [])
		createRoomParams['type'] = callProps.isGroup ? 'group' : 'user'
		createRoomParams['option'] = {
			audio_enabled: true,
			// codec: 'vp8',
			// frame_rate: 0,
			// resolution: '1280x720',
			video_enabled: callProps.video
		}
		console.log('呼叫参数', createRoomParams)

		try {
			f7.dialog.preloader('正在呼叫...')
			// 创建通话
			const { code, data, msg } = await CallService.createLiveApi(createRoomParams)
			if (code !== 200) {
				f7.dialog.alert(msg, () => {
					hangup()
				})
				return
			}
			set({
				...initialState(),
				...status,
				state: LiveRoomStates.WAITING,
				url: data.url,
				room: data.room,
				opened: true
			})
			// 加入房间
			await join()
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	},
	hangup: async () => {
		set({
			state: LiveRoomStates.HANGUP
		})
		const { room, recipient, isGroup } = get()
		console.log('get', get())

		const createRoomParams: any = {}
		!isGroup && (createRoomParams['user_id'] = recipient)
		isGroup && (createRoomParams['group_id'] = Number(recipient))
		createRoomParams['room'] = room
		try {
			await CallService.leaveLiveApi(createRoomParams)
		} finally {
			setTimeout(() => {
				f7.dialog.close()
				set({
					...initialState()
				})
			}, 2000)
		}
	},
	refuse: async () => {
		set({
			state: LiveRoomStates.REFUSE
		})
		const { room, recipient, isGroup } = get()
		const refuseRoomParams: any = {}
		!isGroup && (refuseRoomParams['user_id'] = recipient)
		isGroup && (refuseRoomParams['group_id'] = Number(recipient))
		refuseRoomParams['room'] = room
		try {
			await CallService.rejectLiveApi(refuseRoomParams)
		} finally {
			setTimeout(() => {
				f7.dialog.close()
				set({
					...initialState()
				})
			}, 2000)
		}
	},
	join: async () => {
		const { room, recipient, isGroup, hangup } = get()
		const joinRoomParams: any = {}
		!isGroup && (joinRoomParams['user_id'] = recipient)
		isGroup && (joinRoomParams['group_id'] = Number(recipient))
		joinRoomParams['room'] = room
		try {
			f7.dialog.preloader('连接中...')
			const { code, data, msg } = await CallService.joinLiveApi(joinRoomParams)
			if (code !== 200) {
				f7.dialog.alert(msg, () => {
					hangup()
				})
				return
			}
			set({
				url: data.url,
				token: data.token,
				state: LiveRoomStates.JOINING
			})
		} catch (error: any) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	}
})

export const useLiveRoomStore = create(
	devtools(
		persist(liveRoomStore, {
			name: 'liveRoomStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
