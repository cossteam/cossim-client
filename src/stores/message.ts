import { create } from 'zustand'
import {
	MESSAGE_MARK,
	MESSAGE_READ,
	MESSAGE_SEND,
	MESSAGE_TYPE,
	MessageBurnAfterRead,
	USER_ID,
	addMarkMessage,
	// getMessageFromServer,
	// initMessage,
	updateDialogs
} from '@/shared'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
import MsgService from '@/api/msg'
import { getCookie } from '@/utils/cookie'
import { updateDatabaseMessage } from '@/shared'
import CommonStore from '@/db/common'
import { v4 as uuidv4 } from 'uuid'
import { isEqual, omitBy, isEmpty, differenceBy } from 'lodash-es'

const user_id = getCookie(USER_ID) || ''

interface Options {
	replay_id?: number
	is_group?: boolean
	receiver_id?: string
	dialog_id?: number
	is_forward?: boolean
	at_all_user?: number
	at_users?: string[]
	is_burn_after_reading?: number
	audioData?: {
		file_id: string
		url: string
	}
	msg_url?: string
	file_id?: string
	duration?: number
}

export interface MessageStore {
	messages: PrivateChats[]
	all_meesages: PrivateChats[]
	shareKey: Uint8Array | null
	tableName: string
	is_group: boolean
	receiver_id: string
	dialog_id: number
	userInfo: any
	members: any[]
	myInfo: any
	at_all_user: number
	at_users: string[]
	/** 需要设置已读消息 */
	reads: PrivateChats[]
	/**
	 * 触发 手机触摸事件
	 */
	trgger: boolean
	opened: boolean
	height: number
	refresh: boolean
	num: number
	/**
	 * 更新触发
	 *
	 * @param trgger
	 * @returns
	 */
	updateTrgger: (trgger: boolean) => void
	/**
	 * 更新消息
	 *
	 * @param msg
	 * @returns
	 */
	updateMessage: (msg: any) => Promise<void>
	/**
	 * 删除消息
	 *
	 * @param msg_id
	 * @returns
	 */
	deleteMessage: (msg_id: number) => Promise<void>
	/**
	 * 发送消息并处理发送过程，包括更新本地消息状态和数据库。
	 *
	 * @param {MESSAGE_TYPE} type -消息的类型
	 * @param {string} content -消息的内容
	 * @param {number} [replay_id] -正在回复的消息的ID，可选
	 * @return {Promise<void>}
	 */
	sendMessage: (type: MESSAGE_TYPE, content: string, options?: Options) => Promise<void>
	/**
	 * 编辑消息
	 *
	 * @param msg
	 * @param content
	 * @returns
	 */
	editMessage: (msg: any, content: string) => Promise<void>
	/**
	 * 标记消息
	 *
	 * @param msg
	 * @returns
	 */
	markMessage: (msg: PrivateChats) => Promise<boolean>
	/**
	 * 设置消息已读
	 *
	 * @param msgs
	 * @returns
	 */
	readMessage: (msgs: PrivateChats[]) => Promise<void>
	/**
	 * 初始化消息的函数。
	 *
	 * @param {boolean} is_group -指示对话框是否是一个组
	 * @param {number}dialog_id -对话框的ID
	 * @param {string}receiver_id -消息接收者的id
	 * @return  消息初始化时解析的 Promise
	 */
	initMessage: (is_group: boolean, dialog_id: number, receiver_id: string) => Promise<void>
	/**
	 * 更新消息
	 *
	 * @param msgs
	 * @returns
	 */
	updateMessages: (msgs: PrivateChats[]) => Promise<void>
	/**
	 * 清空消息
	 *
	 * @returns
	 */
	clearMessages: () => Promise<void>
	/**
	 * 更新某条消息
	 *
	 * @param msg
	 * @returns
	 */
	updateMessageById: (msg: PrivateChats) => Promise<void>
	/**
	 * 更新 @ 全体成员
	 *
	 * @param updateAllUser
	 */
	updateAtAllUser: (updateAllUser: boolean) => void
	/**
	 * 更新 @ 成员
	 *
	 * @param updateAtUsers
	 */
	updateAtUsers: (updateAtUsers: string) => void
	/**
	 * 更新设置已读消息
	 *
	 * @param msg
	 */
	updateReads: (msg: PrivateChats) => void
	/**
	 * 清空已读消息
	 *
	 * @returns
	 */
	clearReads: (msgs: PrivateChats[]) => void
	/**
	 * 撤回消息
	 *
	 * @param {PrivateChats} msg
	 */
	recallMessage: (msg: PrivateChats) => Promise<{ success: boolean; msg: string }>
	/**
	 * 更新显示
	 *
	 * @param {boolean} opened
	 */
	updateOpened: (opened: boolean) => void

	/**
	 * 更新页面高度
	 *
	 * @param {number} height
	 */
	updateHeight: (height: number) => void
	/**
	 * 更新刷新
	 *
	 * @param {boolean} refresh
	 */
	updateRefresh: (refresh: boolean) => void
	/**
	 * 从头部添加消息
	 */
	addMessages: () => void
	/**
	 * 创建消息
	 */
	craeteMessage: (type: MESSAGE_TYPE, content: string, options?: Options) => Promise<PrivateChats>
	/**
	 * 发送消息
	 */
	send: (msg: PrivateChats, options?: Options) => Promise<void>
	/**
	 * 更新 DB
	 */
	updateDB: (msg: PrivateChats, error_message: string, isUpdate: boolean) => Promise<void>
}

export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	all_meesages: [],
	shareKey: null,
	tableName: UserStore.tables.private_chats,
	is_group: false,
	receiver_id: '',
	dialog_id: 0,
	userInfo: null,
	members: [],
	myInfo: null,
	trgger: false,
	at_all_user: 0,
	at_users: [],
	reads: [],
	opened: false,
	height: 0,
	refresh: false,
	num: 0,
	updateTrgger: (trgger) => set({ trgger }),

	updateMessage: async (msg) => {
		const { messages } = get()
		set({ messages: [...messages, msg] })
	},
	deleteMessage: async (msg_id: number) => {
		const { tableName, messages } = get()
		try {
			set({ messages: messages.filter((item) => item.msg_id !== msg_id) })
			const id = messages.find((item) => item.msg_id === msg_id)?.id ?? 0
			await UserStore.delete(tableName, 'id', id)
		} catch (error) {
			console.log('删除消息失败', error)
		}
	},
	craeteMessage: async (type, content, options) => {
		let msg: any = {}
		try {
			const { messages, receiver_id, dialog_id, myInfo, at_all_user, at_users, userInfo } = get()
			let { is_group } = get()
			is_group = options?.is_group ?? is_group

			const is_forward = options?.is_forward ?? false
			const isUpdate = (is_forward && receiver_id === options?.receiver_id) || !options?.receiver_id

			msg = {
				dialog_id: options?.dialog_id ?? dialog_id,
				content,
				created_at: Date.now(),
				is_burn_after_reading:
					options?.is_burn_after_reading ?? userInfo?.preferences?.open_burn_after_reading ?? 0,
				is_label: MESSAGE_MARK.NOT_MARK,
				is_read: MESSAGE_READ.READ,
				msg_id: 0,
				msg_send_state: MESSAGE_SEND.SENDING,
				receiver: options?.receiver_id ?? receiver_id,
				read_at: Date.now(),
				reply_id: options?.replay_id ?? 0,
				sender_id: user_id,
				type,
				sender_info: {
					avatar: myInfo?.user_info?.avatar,
					nickname: myInfo?.user_info?.nickname,
					user_id
				},
				at_all_user: at_all_user || 0,
				at_users: at_users || [],
				group_id: is_group ? Number(options?.receiver_id || receiver_id) : 0,
				uid: uuidv4(),
				is_tips: false,
				msg_url: options?.msg_url ?? '',
				file_id: options?.file_id ?? '',
				duration: options?.duration ?? 0
			}
			if (!msg.group_id) msg.group_id = 0
			isUpdate && set({ messages: [...messages, msg] })
		} catch (error) {
			console.log('err', error)
		}
		return msg
	},
	send: async (msg, options) => {
		const { receiver_id, at_all_user, at_users, updateDB } = get()
		let { is_group } = get()

		is_group = options?.is_group ?? is_group
		const is_forward = options?.is_forward ?? false

		// 如果是转发且是自己就需要更新消息
		const isUpdate = (is_forward && receiver_id === options?.receiver_id) || !options?.receiver_id

		let error_message = ''
		try {
			// 上传文件操作
			const params: any = {
				type: msg.type,
				content: msg.content,
				dialog_id: msg.dialog_id,
				replay_id: msg.reply_id,
				is_burn_after_reading: msg.is_burn_after_reading
			}

			if (is_group) {
				params['at_all_user'] = at_all_user || 0
				params['at_users'] = at_users || []
				params['group_id'] = msg.group_id
			} else {
				params['receiver_id'] = msg.receiver
			}

			const {
				code,
				data,
				msg: err
			} = is_group ? await MsgService.sendGroupMessageApi(params) : await MsgService.sendUserMessageApi(params)

			msg.msg_send_state = code === 200 ? MESSAGE_SEND.SEND_SUCCESS : MESSAGE_SEND.SEND_FAILED
			msg.msg_id = data?.msg_id || Date.now()

			// 如果有错误信息
			if (code !== 200) error_message = err
		} catch (error) {
			console.error('发送消息失败', error)
			msg.msg_send_state = MESSAGE_SEND.SEND_FAILED
		} finally {
			updateDB(msg, error_message, isUpdate)
			// const msgs: any[] = []
			// msgs.push(msg)
			// await updateDatabaseMessage(UserStore.tables.messages, msg.uid, msg)

			// // 如果有错误信息
			// if (error_message) {
			// 	msgs.push({
			// 		dialog_id: msg.dialog_id,
			// 		msg_id: null,
			// 		is_tips: true,
			// 		content: error_message,
			// 		type: MESSAGE_TYPE.ERROR,
			// 		uid: uuidv4()
			// 	})
			// 	isUpdate && (await updateDatabaseMessage(UserStore.tables.messages, msgs[1].uid, msgs[1]))
			// } else {
			// 	// 更新会话
			// 	await updateDialogs(msg.dialog_id, msg)
			// }

			// isUpdate &&
			// 	set((state) => ({
			// 		messages: [...state.messages.slice(0, -1), ...msgs],
			// 		at_all_user: 0,
			// 		at_users: []
			// 	}))
		}
	},
	updateDB: async (msg, error_message, isUpdate) => {
		const msgs: any[] = []
		msgs.push(msg)
		await updateDatabaseMessage(UserStore.tables.messages, msg.uid, msg)

		// 如果有错误信息
		if (error_message) {
			msgs.push({
				dialog_id: msg.dialog_id,
				msg_id: null,
				is_tips: true,
				content: error_message,
				type: MESSAGE_TYPE.ERROR,
				uid: uuidv4()
			})
			isUpdate && (await updateDatabaseMessage(UserStore.tables.messages, msgs[1].uid, msgs[1]))
		} else {
			// 更新会话
			await updateDialogs(msg.dialog_id, msg)
		}

		isUpdate &&
			set((state) => ({
				messages: [...state.messages.slice(0, -1), ...msgs],
				at_all_user: 0,
				at_users: []
			}))
	},
	sendMessage: async (type: MESSAGE_TYPE, content: string, options = {}) => {
		const { messages, receiver_id, craeteMessage, send } = get()
		const is_forward = options?.is_forward ?? false
		const isUpdate = (is_forward && receiver_id === options?.receiver_id) || !options?.receiver_id
		const msg = await craeteMessage(type, content, options)

		// 如果是群聊
		if (!msg.group_id) msg.group_id = 0
		isUpdate && set({ messages: [...messages, msg] })
		await send(msg, options)
	},
	editMessage: async (msg: PrivateChats, content: string) => {
		const { is_group, messages, tableName } = get()

		// 首次更新内容和发送状态
		msg.content = content
		msg.msg_send_state = MESSAGE_SEND.SENDING
		set({
			messages: messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, ...msg } : item))
		})

		try {
			const params = {
				msg_type: msg?.type,
				content,
				msg_id: msg?.msg_id
			}
			const { code } = is_group
				? await MsgService.editGroupMessageApi(params)
				: await MsgService.editUserMessageApi(params)

			msg.msg_send_state = code === 200 ? MESSAGE_SEND.SEND_SUCCESS : MESSAGE_SEND.SEND_FAILED
		} catch (error) {
			msg.msg_send_state = MESSAGE_SEND.SEND_FAILED
		} finally {
			set((state) => ({
				messages: state.messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, ...msg } : item))
			}))
			await updateDatabaseMessage(tableName, msg.uid, msg, true)
		}
	},
	markMessage: async (msg: PrivateChats) => {
		const { is_group, messages, tableName } = get()
		try {
			const params = {
				msg_id: msg?.msg_id,
				is_label: msg?.is_label === MESSAGE_MARK.MARK ? MESSAGE_MARK.NOT_MARK : MESSAGE_MARK.MARK
			}
			const { code } = is_group
				? await MsgService.labelGroupMessageApi(params)
				: await MsgService.labelUserMessageApi(params)

			if (code === 200) {
				msg.is_label = params.is_label
				const newMessage = messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, ...msg } : item))
				await updateDatabaseMessage(tableName, msg.uid, msg, true)
				const tipsMessage = await addMarkMessage(tableName, msg, msg.is_label)
				newMessage.push(tipsMessage as any)
				set({ messages: newMessage })
			}
		} catch (error) {
			console.error('标记消息失败:', error)
			return false
		}
		return true
	},
	readMessage: async (msgs) => {
		const { is_group, dialog_id, tableName, receiver_id, clearReads, messages } = get()

		// 未读消息
		const unReadMsgs = msgs.filter((item) => item?.is_read === MESSAGE_READ.NOT_READ)
		const msg_ids = unReadMsgs.map((item) => item.msg_id)

		if (!msg_ids.length) return

		const params: any = { msg_ids, dialog_id }

		if (is_group) params['group_id'] = Number(receiver_id)

		const { code } = is_group
			? await MsgService.readGroupMessageApi(params)
			: await MsgService.readUserMessageApi(params)

		// 更新本地数据库
		if (code === 200) {
			unReadMsgs.map((item) => {
				updateDatabaseMessage(tableName, item.uid, { ...item, is_read: MESSAGE_READ.READ }, true)
			})

			clearReads(msgs)

			// 更新消息
			set({
				messages: messages.map((item) => {
					if (msg_ids.includes(item.msg_id)) {
						return { ...item, is_read: MESSAGE_READ.READ }
					}
					return item
				})
			})

			// 更新会话
			const dialog = await UserStore.findOneById(UserStore.tables.dialogs, 'dialog_id', dialog_id)

			if (dialog) {
				await UserStore.update(UserStore.tables.dialogs, 'dialog_id', dialog_id, {
					...dialog,
					dialog_unread_count: 0
				})
			}
		}
	},
	initMessage: async (is_group: boolean, dialog_id: number, receiver_id: string) => {
		const { height } = get()
		const num = Math.ceil(height / 80)

		const tableName = UserStore.tables.messages
		const messages = await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', dialog_id)

		// 获取服务器上的消息
		// getMessageFromServer(receiver_id, is_group).then((res: any) => {
		// 	const data = res?.group_messages || res?.user_messages || []
		// 	const newData: any[] = data.map((v: any) => ({
		// 		...v,
		// 		msg_id: v?.id,
		// 		at_all_user: v?.at_all_user ?? 0,
		// 		at_users: v?.at_users ?? []
		// 	}))

		// 	if (!messages?.length) {
		// 		if (!data.length) return
		// 		const messages: any[] = data
		// 			.map((v: any) => ({
		// 				...v,
		// 				msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
		// 				uid: uuidv4()
		// 			}))
		// 			?.reverse()
		// 		set({ messages })
		// 		UserStore.bulkAdd(UserStore.tables.messages, messages)
		// 		return
		// 	}

		// 	// TODO: 对比两个数组的差异，更新本地数据库
		// 	differenceBy(newData || [], messages, 'msg_id')
		// 	// console.log('diff', diffData, newData, messages)
		// 	// console.log('messages', messages)
		// })

		// 当前会话的信息，如果是私聊就是好友信息，如果是群聊就是群信息
		const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', receiver_id)
		// 自己的信息
		const myInfo = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)

		set({
			messages: messages.slice(-num),
			tableName,
			num,
			is_group,
			receiver_id,
			dialog_id,
			all_meesages: messages,
			userInfo,
			myInfo
		})

		// setTimeout(() => {
		// 	set({ messages })
		// }, 1000)

		// 设置已读
		// readMessage(messages)
	},
	updateMessages: async (msgs) => {
		try {
			const { messages } = get()
			// @ts-ignore
			const differences = omitBy(messages, (value, key) => isEqual(value, msgs[key]))

			if (isEmpty(differences)) return
			console.log('Object.values(differences)', Object.values(differences))

			set({ messages: [...messages, ...Object.values(differences)] })
		} catch (error) {
			console.error('更新消息失败', error)
		}
	},
	clearMessages: async () => {
		set({ messages: [], all_meesages: [], dialog_id: 0, refresh: false })
	},
	updateMessageById: async (msg: PrivateChats) => {
		const { messages } = get()
		const newMessages = messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, ...msg } : item))
		set({ messages: newMessages })
	},
	updateAtAllUser: (updateAllUser: boolean) => {
		set({ at_all_user: updateAllUser ? 1 : 0 })
	},
	updateAtUsers: (atUsers: string) => {
		const { at_users } = get()
		set({ at_users: [...at_users, atUsers] })
	},
	updateReads: (msg) => {
		const { reads, userInfo } = get()
		const index = reads.findIndex((item) => item.msg_id === msg.msg_id)
		if (index === -1) {
			set({ reads: [...reads, msg] })
		} else {
			const newReads = reads.filter((item) => item.msg_id !== msg.msg_id)
			set({ reads: newReads })
		}

		// 判断消息是否阅后即焚
		if (msg?.is_burn_after_reading === MessageBurnAfterRead.YES) {
			UserStore.add(UserStore.tables.read_destroy, {
				uid: msg.uid,
				msg_id: msg?.msg_id,
				read_time: Date.now(),
				// TODO: 等待后端把每条消息的阅后即焚时间传过来
				self_destruct_time: userInfo?.preferences?.open_burn_after_reading_time_out ?? 10
			})
		}
	},
	clearReads: (msgs) => {
		const { reads } = get()
		const newReads = differenceBy(reads, msgs, 'msg_id')
		set({ reads: newReads })
	},
	recallMessage: async (msg: any) => {
		const { messages, is_group } = get()
		try {
			const params = { msg_id: msg.msg_id }
			const { code, msg: error_msg } = is_group
				? await MsgService.revokeGroupMessageApi(params)
				: await MsgService.revokeUserMessageApi(params)
			if (code !== 200) return { success: false, msg: error_msg }
			const newMessages: any = messages.filter((item: any) => item.msg_id !== msg.msg_id)
			UserStore.delete(UserStore.tables.messages, 'id', msg.id)
			set({ messages: newMessages })
			return { success: false, msg: '撤回消息成功' }
		} catch (error) {
			console.error(error)
			return { success: false, msg: '撤回消息失败' }
		}
	},
	updateOpened: (opened) => set({ opened }),
	updateHeight: (height) => set({ height }),
	updateRefresh: (refresh) => set({ refresh }),
	addMessages: async () => {
		const { messages, all_meesages, num, refresh } = get()

		if (refresh) return
		set({ refresh: true })

		if (messages.length >= all_meesages.length) return set({ refresh: false })
		const newMessages = all_meesages.slice(-(num + messages.length))
		setTimeout(() => {
			set({ messages: newMessages, refresh: false })
		}, 1000)
	}
}))
