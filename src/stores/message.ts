import { create } from 'zustand'
import {
	MESSAGE_MARK,
	MESSAGE_READ,
	MESSAGE_SEND,
	MESSAGE_TYPE,
	USER_ID,
	addMarkMessage,
	getMessageFromServer,
	initMessage,
	updateDialogs
} from '@/shared'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
import MsgService from '@/api/msg'
import { getCookie } from '@/utils/cookie'
import { updateDatabaseMessage } from '@/shared'
import CommonStore from '@/db/common'
import { v4 as uuidv4 } from 'uuid'
import { isEqual, omitBy, isEmpty } from 'lodash-es'

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
	updateMessage: (msg: any) => Promise<void>
	deleteMessage: (msg_id: number) => Promise<void>
	sendMessage: (type: MESSAGE_TYPE, content: string, options?: Options) => Promise<void>
	editMessage: (msg: any, content: string) => Promise<void>
	markMessage: (msg: PrivateChats) => Promise<boolean>
	readMessage: (msgs: PrivateChats[]) => Promise<void>
	initMessage: (is_group: boolean, dialog_id: number, receiver_id: string) => Promise<void>
	updateMessages: (msgs: PrivateChats[]) => Promise<void>
	clearMessages: () => Promise<void>
	updateMessageById: (msg: PrivateChats) => Promise<void>
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
	updateMessage: async (msg: PrivateChats) => {
		const { messages } = get()
		set({ messages: [...messages, msg] })
	},
	deleteMessage: async (msg_id: number) => {
		const { tableName, messages } = get()
		try {
			set({ messages: messages.filter((item) => item.msg_id !== msg_id) })
			await UserStore.delete(tableName, 'msg_id', msg_id)
		} catch (error) {
			console.log('删除消息失败', error)
		}
	},
	/**
	 * 发送消息并处理发送过程，包括更新本地消息状态和数据库。
	 *
	 * @param {MESSAGE_TYPE} type -消息的类型
	 * @param {string} content -消息的内容
	 * @param {number} [replay_id] -正在回复的消息的ID，可选
	 * @return {Promise<void>}
	 */
	sendMessage: async (type: MESSAGE_TYPE, content: string, options = {}) => {
		const { messages, receiver_id, dialog_id, myInfo } = get()

		let error_message = ''

		// 判断是否是群聊
		let { is_group, tableName } = get()
		if (options?.is_group) {
			is_group = options?.is_group
			tableName = is_group ? UserStore.tables.group_chats : UserStore.tables.private_chats
		}

		const { is_forward = false } = options

		const msg: any = {
			dialog_id: options?.dialog_id ?? dialog_id,
			content,
			create_at: Date.now(),
			is_burn_after_reading: options?.is_burn_after_reading ?? 0,
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
			at_all_user: options?.at_all_user || 0,
			at_users: options?.at_users || [],
			group_id: is_group ? Number(options?.receiver_id || receiver_id) : 0,
			uid: uuidv4(),
			is_tips: false
		}
		set({ messages: [...messages, msg] })

		try {
			const params: any = {
				type,
				content,
				dialog_id: msg.dialog_id,
				replay_id: msg.reply_id,
				is_burn_after_reading: 0
			}

			if (is_group) {
				params['at_all_user'] = options?.at_all_user || 0
				params['at_users'] = options?.at_users || []
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
			const msgs: any[] = []
			msgs.push(msg)
			!is_forward && (await updateDatabaseMessage(tableName, msg.uid, msg))

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
				!is_forward && (await updateDatabaseMessage(tableName, msgs[1].uid, msgs[1]))
			} else {
				// 更新会话
				await updateDialogs(msg.dialog_id, msg)
			}

			set((state) => ({ messages: [...state.messages.slice(0, -1), ...msgs] }))
		}
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
		// 未读消息
		const unReadMsgs = msgs.filter((item) => item?.is_read === MESSAGE_READ.NOT_READ)
		const msg_ids = unReadMsgs.map((item) => item.msg_id)

		if (!msg_ids.length) return

		const { is_group, dialog_id, tableName, receiver_id } = get()

		const params: any = { msg_ids, dialog_id }

		if (!is_group) params['group_id'] = Number(receiver_id)

		const { code } = is_group
			? await MsgService.readGroupMessageApi(params)
			: await MsgService.readUserMessageApi(params)

		// 更新本地数据库
		if (code === 200) {
			unReadMsgs.map((item) => {
				updateDatabaseMessage(tableName, item.uid, { ...item, is_read: MESSAGE_READ.READ }, true)
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
	/**
	 * 初始化消息的函数。
	 *
	 * @param {boolean} is_group -指示对话框是否是一个组
	 * @param {number}dialog_id -对话框的ID
	 * @param {string}receiver_id -消息接收者的id
	 * @return  消息初始化时解析的 Promise
	 */
	initMessage: async (is_group: boolean, dialog_id: number, receiver_id: string) => {
		const { shareKey, readMessage } = get()

		// TODO: 移除
		// const tableName = is_group ? UserStore.tables.group_chats : UserStore.tables.private_chats
		const tableName = UserStore.tables.messages

		const messages = await initMessage({
			tableName,
			dialog_id,
			shareKey
		})

		// 获取服务器上的消息
		getMessageFromServer(receiver_id, is_group).then((res: any) => {
			const newMessages = messages.filter((v) => v?.msg_send_state === MESSAGE_SEND.SEND_SUCCESS)
			const msgFormServer = res?.user_messages?.[0] || res?.group_messages?.[0]
			const msgFormStore = newMessages?.at(-1)

			console.log('获取服务器上的消息', res, newMessages)
			if (msgFormServer?.id !== msgFormStore?.msg_id) {
				console.log('需要加载服务器消息', msgFormServer, msgFormStore)
			}
		})

		// 当前会话的信息，如果是私聊就是好友信息，如果是群聊就是群信息
		const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', receiver_id)

		// TODO: 获取好友信息

		// 自己的信息
		const myInfo = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)

		set({ messages, tableName, is_group, receiver_id, dialog_id, all_meesages: messages, userInfo, myInfo })

		// 设置已读
		readMessage(messages)
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
		set({ messages: [], all_meesages: [] })
	},
	updateMessageById: async (msg: PrivateChats) => {
		const { messages } = get()
		const newMessages = messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, ...msg } : item))
		console.log('newMessages', msg, newMessages)

		set({ messages: newMessages })
	}
}))
