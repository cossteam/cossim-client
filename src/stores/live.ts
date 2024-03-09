import { SocketEvent } from '@/shared'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

export enum OwnEventEnum {
	/** 空闲 */
	IDLE,
	/** 等待中 */
	WAITING,
	/** 拒绝 */
	REFUSE,
	/** 通话中 */
	BUSY,
	/** 挂断 */
	HANGUP
}

interface LiveStoreParams {
	/** ID */
	id: undefined
	/** 是否显示通话界面 */
	opened: boolean
	/** 是否群聊 */
	isGroup: boolean
	/** 成员 */
	members: Array<any>
	/** 开启麦克风 */
	audio: boolean
	/** 开启摄像头 */
	video: boolean
	/** 对方触发的通话事件 */
	event: SocketEvent | null
	/** 事件数据 */
	eventDate: any
	/** 我的的通话事件 */
	ownEvent: OwnEventEnum
}

interface LiveStoreFunc {
	/** 呼叫 */
	call: (callProps: CallProps) => void
	/** 拒绝接通 */
	refuse: () => void
	/** 接通电话 */
	accept: () => void
	/** 挂断电话 */
	hangup: () => void
	/** 更新通话界面显示状态 */
	updateOpened: (opened: boolean) => void
	/** 更新事件及事件数据 */
	updateEvent: (event: SocketEvent, eventDate: any) => void
	/** 事件描述 */
	eventDesc: (event: SocketEvent) => string
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
	id: undefined,
	isGroup: false,
	members: [],
	audio: true,
	video: false,
	event: null,
	eventDate: null,
	ownEvent: OwnEventEnum.IDLE
})

export const liveStore = (set: any): LiveStore => ({
	...initialState(),
	call: (callProps: CallProps) => {
		const status: CallProps = {
			id: callProps.id,
			isGroup: callProps.isGroup
		}
		callProps.members && (status['members'] = callProps.members)
		callProps.audio && (status['audio'] = callProps.audio)
		callProps.video && (status['video'] = callProps.video)
		set({
			...initialState(),
			...status,
			opened: true,
			ownEvent: OwnEventEnum.WAITING // 等待创建房间以及加入房间
		})
	},
	refuse: () => {
		set({
			...initialState(),
			ownEvent: OwnEventEnum.REFUSE
		})
	},
	accept: () => {
		set({
			ownEvent: OwnEventEnum.BUSY
		})
	},
	hangup: () => {
		set({
			...initialState(),
			ownEvent: OwnEventEnum.HANGUP
		})
	},
	updateOpened: (opened: boolean) => {
		set({ opened })
	},
	updateEvent: (event: SocketEvent, eventDate: any) => {
		set({ event, eventDate })
	},
	eventDesc: (event: SocketEvent): string => {
		switch (event) {
			case SocketEvent.UserCallReqEvent:
			case SocketEvent.GroupCallReqEvent:
				return '邀请你加入通话'
			case SocketEvent.UserCallRejectEvent:
			case SocketEvent.GroupCallRejectEvent:
				return '对方已拒绝'
			case SocketEvent.UserCallHangupEvent:
			case SocketEvent.GroupCallHangupEvent:
				return '对方已挂断'
			default:
				return ''
		}
	},
	ownEventDesc: (event: OwnEventEnum): string => {
		switch (event) {
			case OwnEventEnum.IDLE:
				return '空闲'
			case OwnEventEnum.WAITING:
				return '等待中'
			case OwnEventEnum.REFUSE:
				return '已拒绝'
			case OwnEventEnum.BUSY:
				return '通话中'
			case OwnEventEnum.HANGUP:
				return '已挂断'
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
