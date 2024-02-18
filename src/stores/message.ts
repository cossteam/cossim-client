import { create } from 'zustand'
import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MESSAGE_TYPE, USER_ID, initMessage } from '@/shared'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
import MsgService from '@/api/msg'
import { getCookie } from '@/utils/cookie'
import { updateDatabaseMessage } from '@/shared'

const user_id = getCookie(USER_ID) || ''

// interface Options {
// 	replay_id?: string
// }

interface MessageStore {
	messages: PrivateChats[]
	all_meesages: PrivateChats[]
	shareKey: Uint8Array | null
	tableName: string
	is_group: boolean
	receiver_id: string
	dialog_id: number
	userInfo: any
	updateMessage: (msg: any) => Promise<void>
	deleteMessage: () => Promise<void>
	sendMessage: (type: MESSAGE_TYPE, content: string, replay_id?: number) => Promise<void>
	editMessage: () => Promise<void>
	markMessage: () => Promise<void>
	readMessage: () => Promise<void>
	initMessage: (is_group: boolean, dialog_id: number, receiver_id: string) => Promise<void>
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
	updateMessage: async (msg: PrivateChats) => {
		const { messages } = get()
		set({ messages: [...messages, msg] })
	},
	deleteMessage: async () => {},
	sendMessage: async (type: MESSAGE_TYPE, content: string, replay_id?: number) => {
		const { is_group, messages, receiver_id, dialog_id, tableName } = get()
		const msg: PrivateChats = {
			msg_id: Date.now(),
			sender_id: user_id,
			receiver_id,
			content,
			type,
			replay_id: replay_id ?? 0,
			is_read: MESSAGE_READ.READ,
			read_at: Date.now(),
			created_at: Date.now(),
			dialog_id,
			is_label: MESSAGE_MARK.NOT_MARK,
			is_burn_after_reading: 0,
			msg_send_state: MESSAGE_SEND.SENDING
		}
		set({ messages: [...messages, msg] })

		try {
			const params = { type, content, receiver_id, dialog_id, replay_id }
			const { code, data } = is_group
				? await MsgService.sendGroupMessageApi(params)
				: await MsgService.sendUserMessageApi(params)

			msg.msg_send_state = code === 200 ? MESSAGE_SEND.SEND_SUCCESS : MESSAGE_SEND.SEND_FAILED
			msg.msg_id = data?.meg_id || Date.now()
		} catch (error) {
			console.error('发送消息失败', error)
		} finally {
			set((state) => ({ messages: [...state.messages.slice(0, -1), msg] }))
			updateDatabaseMessage(tableName, msg.msg_id, msg)
		}
	},
	editMessage: async () => {},
	markMessage: async () => {},
	readMessage: async () => {},
	initMessage: async (is_group: boolean, dialog_id: number, receiver_id: string) => {
		const { shareKey } = get()
		const tableName = is_group ? UserStore.tables.group_chats : UserStore.tables.private_chats
		const messages = await initMessage({
			tableName,
			dialog_id,
			shareKey
		})
		const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', receiver_id)

		set({ messages, tableName, is_group, receiver_id, dialog_id, userInfo })
	}
}))
