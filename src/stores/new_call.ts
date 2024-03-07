import { CallStatus } from '@/pages/Call/enums'
import { CallOption } from '@/pages/Call/types'
import { SocketEvent } from '@/shared'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { checkMedia } from '@/utils/media'
import CallService from '@/api/call'
import { f7 } from 'framework7-react'
// import CallService from '@/api/call'

interface Room {
	id: string | number // 对方ID（好友或者群）
	isGroup: boolean
	members?: Array<string> // 群成员ID
	option?: CallOption // 我的通话选项
	serverUrl: string
	token: string
}

interface newCallStore {
	// 是否可见
	visible: boolean
	updateVisible: (visible: boolean) => void
	// 通话状态
	status: CallStatus
	// updateStatus: (status: CallStatus) => void
	statusText: (status: CallStatus) => string
	// 房间信息
	room: Room | null
	// 处理通话事件
	handlerCallEvent: (event: SocketEvent, data: any) => void
	// 创建房间
	createRoom: (id: string | number, option: CallOption, isGroup: boolean, members?: Array<string>) => Promise<any>
	// 加入房间
	joinRoom: (id: string | number, option?: CallOption) => Promise<any>
	// 呼叫
	call: (id: string | number, option: CallOption, isGroup: boolean, members?: Array<any>) => Promise<any>
	// 离开房间
	leaveRoom: (id: string | number) => Promise<any>
	// 拒绝加入房间
	refuseJoinRoom: (id: string | number) => Promise<any>
}

export const callStore = (set: any, get: any): newCallStore => ({
	// 是否可见
	visible: false,
	updateVisible: (visible) => {
		set({ visible })
	},
	// 通话状态
	status: CallStatus.IDLE,
	// updateStatus: (status: CallStatus) => {
	// 	set({ status })
	// },
	statusText: (status: CallStatus) => {
		switch (status) {
			case CallStatus.IDLE /** 空闲 */:
				return '空闲'
			case CallStatus.WAITING /** 等待中 */:
				return '等待中'
			case CallStatus.REFUSE /** 被拒绝 */:
				return '已拒绝'
			case CallStatus.CALL /** 通话中 */:
				return '通话中'
			case CallStatus.HANGUP /** 被挂断 */:
				return '已挂断'
			default:
				return ''
		}
	},
	// 房间信息
	room: null,
	// 处理通话事件
	handlerCallEvent: (event: SocketEvent, data: any) => {
		console.log('处理通话事件', event, data)
		switch (event) {
			case SocketEvent.UserCallReqEvent: // 用户来电
			case SocketEvent.GroupCallReqEvent: // 群聊来电
				{
					const isGroup = event === SocketEvent.GroupCallReqEvent
					set({
						status: CallStatus.WAITING,
						room: {
							id: !isGroup ? data?.data?.sender_id : data?.data?.group_id,
							isGroup
							// members: [],
							// option: null
						},
						visible: true
					})
				}
				break
			case SocketEvent.UserCallRejectEvent: // 用户拒绝
			case SocketEvent.GroupCallRejectEvent: // 群聊拒绝
				set({ status: CallStatus.REFUSE })
				setTimeout(() => {
					set({ visible: false })
				}, 3000)
				break
			case SocketEvent.UserCallHangupEvent: // 用户挂断
			case SocketEvent.GroupCallHangupEvent: // 群聊挂断
				set({ status: CallStatus.REFUSE })
				setTimeout(() => {
					set({ visible: false })
				}, 3000)
				break
		}
	},
	// 创建房间
	createRoom: (id: string | number, option: CallOption, isGroup: boolean, members?: Array<any>) => {
		return new Promise<any>((resolve, reject) => {
			// 创建通话参数
			const createRoomParams: any = {}
			!isGroup && (createRoomParams['user_id'] = id)
			isGroup && (createRoomParams['group_id'] = Number(id))
			isGroup && (createRoomParams['member'] = members?.map((i: any) => i.user_id) ?? [])
			createRoomParams['option'] = {
				// audio_enabled: true,
				// codec: 'vp8',
				// frame_rate: 0,
				// resolution: '1280x720',
				video_enabled: option?.videoEnabled
			}
			// 创建通话
			const createResp = !isGroup
				? CallService.createLiveUserApi(createRoomParams)
				: CallService.createLiveGroupApi(createRoomParams)
			createResp
				.then(({ code, data, msg }) => {
					set({
						room: {
							id,
							isGroup,
							members,
							option
						}
					})
					if (code === 200) {
						set({
							status: CallStatus.WAITING,
							visible: true
						})
						resolve(data)
						return
					}
					if (code === 400) {
						// 通话中
						set({
							status: CallStatus.CALL,
							visible: true
						})
						return
					}
					reject(msg)
				})
				.catch((error) => {
					set({
						status: CallStatus.IDLE,
						visible: false
					})
					reject(error)
				})
		})
	},
	// 加入房间(获取websoket推送数据)
	joinRoom: (id: string | number, option?: CallOption) => {
		return new Promise<any>((resolve, reject) => {
			const { room } = get()
			const isGroup = room?.isGroup
			const joinRoomParams: any = {}
			!isGroup && (joinRoomParams['user_id'] = id)
			isGroup && (joinRoomParams['group_id'] = Number(id))
			const joinResp = !isGroup
				? CallService.joinLiveUserApi(joinRoomParams)
				: CallService.joinLiveGroupApi(joinRoomParams)
			joinResp
				.then(({ code, data, msg }) => {
					console.log('加入房间', code, data, msg)
					if (code === 200) {
						set({
							status: CallStatus.CALL,
							room: {
								id,
								isGroup,
								option,
								serverUrl: data?.url,
								token: data?.token
							}
						})
						resolve(data)
						return
					}
					setTimeout(() => {
						set({
							status: CallStatus.IDLE,
							visible: false
						})
					}, 3000)
					reject({ code, data, msg })
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	// 呼叫
	call: async (id: string | number, option: CallOption, isGroup: boolean, members?: Array<any>) => {
		// 权限检查
		try {
			await checkMedia(option?.videoEnabled)
		} catch (error: any) {
			console.dir(error)
			f7.dialog.alert(error, '请检查媒体设备权限')
			return
		}
		try {
			set({
				room: {}
			})
			const { createRoom, joinRoom } = get()
			await createRoom(id, option, isGroup, members)
			await joinRoom(id, option)
		} catch (error: any) {
			console.dir(error)
			f7.dialog.alert(error, '呼叫失败')
		}
	},
	// 离开房间
	leaveRoom: (id: string | number) => {
		return new Promise<void>((resolve, reject) => {
			const { room } = get()
			const isGroup = room?.isGroup
			const leaveRoomParams: any = {}
			!isGroup && (leaveRoomParams['user_id'] = id)
			isGroup && (leaveRoomParams['group_id'] = Number(id))
			const leaveResp = !isGroup
				? CallService.leaveLiveUserApi(leaveRoomParams)
				: CallService.leaveLiveGroupApi(leaveRoomParams)
			leaveResp
				.then(() => {
					resolve()
				})
				.catch((error) => {
					reject(error)
				})
				.finally(() => {
					set({
						status: CallStatus.HANGUP
					})
					setTimeout(() => {
						set({
							room: null,
							status: CallStatus.IDLE,
							visible: false
						})
					}, 3000)
				})
		})
	},
	// 拒绝加入房间
	refuseJoinRoom: (id: string | number) => {
		return new Promise<void>((resolve, reject) => {
			const { room } = get()
			const isGroup = room?.isGroup
			const refuseRoomParams: any = {}
			!isGroup && (refuseRoomParams['user_id'] = id)
			isGroup && (refuseRoomParams['group_id'] = Number(id))
			const refuseResp = !isGroup
				? CallService.rejectLiveUserApi(refuseRoomParams)
				: CallService.rejectLiveGroupApi(refuseRoomParams)
			refuseResp
				.then(() => {
					resolve()
				})
				.catch((error) => {
					reject(error)
				})
				.finally(() => {
					set({
						status: CallStatus.REFUSE
					})
					setTimeout(() => {
						set({
							room: null,
							status: CallStatus.IDLE,
							visible: false
						})
					}, 3000)
				})
		})
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
