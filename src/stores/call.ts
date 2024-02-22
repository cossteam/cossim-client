import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { CallStatus, CallType } from '@/shared'
import CallService from '@/api/call'

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
	waitingTime: Date | null
	/** 通话类型 */
	type: CallType
	/** 是否启用视频通话 */
	enablesVideo: boolean
	/** 更新通话信息 */
	updateCallInfo: (callInfo: any) => void
	/** 更新通话状态 */
	updateStatus: (status: CallStatus) => void
	/** 处理超时 */
	handlerTimeout: () => void
	/** 更新等待通话时间 */
	updateWaitingTime: (waitingTime: Date) => void
	/** 更新通话类型 */
	updateType: (type: CallType) => void
	/** 使能通话视频 */
	updateEnablesVideo: (enablesVideo: boolean) => void
	/** 呼叫（呼叫方） */
	call: (callInfo: { userInfo?: any; groupInfo?: any; eventInfo?: any }) => Promise<void>
	/** 拒绝（接收方） */
	reject: () => Promise<void>
	/** 接通（接收方） */
	accept: () => Promise<void>
	/** 挂断（呼叫方、接收方） */
	hangup: () => Promise<void>
}

export const callStore = (set: any, get: any): CallStore => ({
	callInfo: null,
	status: CallStatus.IDLE,
	waitingTime: null,
	type: CallType.AUDIO,
	enablesVideo: true,
	updateCallInfo: (callInfo: any) => {
		set({ callInfo })
	},
	updateStatus: (status: CallStatus) => {
		set({ status })
	},
	handlerTimeout: () => {
		set({
			callInfo: null,
			status: CallStatus.IDLE,
			waitingTime: null,
			type: CallType.AUDIO,
			enablesVideo: true
		})
	},
	updateWaitingTime: (waitingTime: Date) => {
		set({ waitingTime })
	},
	updateType: (type: CallType) => {
		set({ type })
	},
	updateEnablesVideo: (enablesVideo: boolean) => {
		set({ enablesVideo })
	},
	call: async (callInfo) => {
		try {
			set({ callInfo })
			set({ status: CallStatus.WAITING })
			// 创建通话
			const isUser = callInfo?.userInfo?.user_id
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
			const createResp = isUser
				? await CallService.createLiveUserApi(createRoomParams)
				: await CallService.createLiveGroupApi(createRoomParams)
			if (createResp.code !== 200) {
				createResp.code === 400 && set({ status: CallStatus.CALLING })
				return Promise.reject({
					...createResp,
					message: createResp.msg
				})
			}
			// 加入通话
			const joinResp = isUser ? await CallService.joinLiveUserApi({}) : await CallService.joinLiveGroupApi({})
			if (joinResp.code !== 200) {
				return Promise.reject({
					...joinResp,
					message: joinResp.msg
				})
			}
			set({ callInfo: { ...callInfo, wsInfo: joinResp.data } }) // 更新通话信息
			set({ status: CallStatus.CALLING })
			return Promise.resolve(joinResp.data)
		} catch (error) {
			return Promise.reject(error)
		}
	},
	reject: async () => {
		try {
			const { callInfo } = get()
			const isUser = callInfo?.userInfo?.user_id
			console.log(isUser)
			const rejectResp = isUser ? await CallService.rejectLiveUserApi() : await CallService.rejectLiveGroupApi()
			if (rejectResp.code !== 200) {
				return Promise.reject({
					...rejectResp,
					message: rejectResp.msg
				})
			}
			set({ status: CallStatus.REFUSE })
			return Promise.resolve()
		} catch (error: any) {
			return Promise.resolve(error)
		} finally {
			setTimeout(() => {
				set({ callInfo: null })
				set({ status: CallStatus.IDLE })
			}, 2000)
		}
	},
	accept: async () => {
		try {
			const { callInfo } = get()
			const isUser = callInfo?.userInfo?.user_id
			console.log(isUser)
			const joinResp = isUser ? await CallService.joinLiveUserApi({}) : await CallService.joinLiveGroupApi({})
			if (joinResp.code !== 200) {
				return Promise.reject({
					...joinResp,
					message: joinResp.msg
				})
			}
			set({ callInfo: { ...callInfo, wsInfo: joinResp.data } }) // 更新通话信息
			set({ status: CallStatus.CALLING })
			return Promise.resolve(joinResp.data)
		} catch (error: any) {
			return Promise.resolve(error)
		}
	},
	hangup: async () => {
		try {
			const { callInfo } = get()
			const isUser = callInfo?.userInfo?.user_id
			console.log(isUser)
			const leaveResp = isUser ? await CallService.leaveLiveUserApi() : await CallService.leaveLiveGroupApi()
			if (leaveResp.code !== 200) {
				return Promise.reject({
					...leaveResp,
					message: leaveResp.msg
				})
			}
			set({ status: CallStatus.HANGUP })
			return Promise.resolve()
		} catch (error: any) {
			return Promise.resolve(error)
		} finally {
			setTimeout(() => {
				set({ callInfo: null })
				set({ status: CallStatus.IDLE })
			}, 2000)
		}
	}
})

export const useCallStore = create(
	devtools(
		persist(callStore, {
			name: 'callStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
