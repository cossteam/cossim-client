import { create } from 'zustand'
import { CallStatus, CallType } from '@/shared'
import { createLiveUserApi, createLiveGroupApi, joinLiveUserApi, joinLiveGroupApi } from '@/api/call'

// interface CreateRoomParams {
// 	user_id: 0
// 	group_id: 0
// 	member: ['string']
// 	option: {
// 		audio_enabled: true
// 		codec: 'string'
// 		frame_rate: 0
// 		resolution: 'string'
// 		video_enabled: true
// 	}
// }

interface CallStore {
	/** 通话信息 */
	callInfo: any
	/** 通话状态 */
	status: CallStatus
	/** 通话类型 */
	type: CallType
	/** 是否启用视频通话 */
	enablesVideo: boolean
	/** 更新通话信息 */
	updateCallInfo: (callInfo: any) => void
	/** 更新通话状态 */
	updateStatus: (status: CallStatus) => void
	/** 更新通话类型 */
	updateType: (type: CallType) => void
	/** 使能通话视频 */
	updateEnablesVideo: (enablesVideo: boolean) => void
	/** 呼叫（呼叫方） */
	call: (
		callInfo: {
			userInfo?: any
			groupInfo?: any
			eventInfo?: any
		},
		callback?: () => void
	) => void
	/** 拒绝（接收方） */
	reject: (callback?: () => void) => void
	/** 接通（接收方） */
	accept: (callback?: () => void) => void
	/** 挂断（呼叫方、接收方） */
	hangup: (callback?: () => void) => void
}

export const useCallStore = create<CallStore>((set) => ({
	callInfo: null,
	status: CallStatus.IDLE,
	type: CallType.AUDIO,
	enablesVideo: true,
	updateCallInfo: (callInfo: any) => {
		set({ callInfo })
	},
	updateStatus: (status: CallStatus) => {
		set({ status })
	},
	updateType: (type: CallType) => {
		set({ type })
	},
	updateEnablesVideo: (enablesVideo: boolean) => {
		set({ enablesVideo })
	},
	call: async (callInfo, callback?: () => void) => {
		set({ callInfo })
		set({ status: CallStatus.WAITING })

		try {
			// 回调
			callback && callback()
			// 创建通话
			const isUser = callInfo?.userInfo?.user_id
			const callApi = isUser ? createLiveUserApi : createLiveGroupApi
			const createRoomParams = {
				[isUser ? 'user_id' : 'group_id']: isUser ? callInfo?.userInfo?.user_id : callInfo?.groupInfo?.group_id
			}
			!isUser && (createRoomParams['member'] = callInfo?.groupInfo?.member || [])
			// createRoomParams['option'] = {
			// 	audio_enabled: true,
			// 	codec: 'vp8',
			// 	frame_rate: 0,
			// 	resolution: '1280x720',
			// 	video_enabled: true
			// }
			await callApi(createRoomParams)
			// 加入通话
			isUser ? await joinLiveUserApi({}) : await joinLiveGroupApi({})
		} catch (error) {
			console.log(error)
			// 修改状态
			set({ status: CallStatus.IDLE })
		}
	},
	reject: (callback?: () => void) => {
		set({ status: CallStatus.REFUSE })
		callback && callback()
		setTimeout(() => {
			set({ status: CallStatus.IDLE })
		})
	},
	accept: (callback?: () => void) => {
		set({ status: CallStatus.CALLING })
		callback && callback()
	},
	hangup: (callback?: () => void) => {
		set({ status: CallStatus.HANGUP })
		callback && callback()
		setTimeout(() => {
			set({ status: CallStatus.IDLE })
		})
	}
}))
