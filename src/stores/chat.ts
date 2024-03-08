import { create } from 'zustand'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
import { ChatStore } from '@/types/store/chat'

// const user_id = getCookie(USER_ID) || ''

export const useChatStore = create<ChatStore>((set, get) => ({
	opened: false,
	receiver_info: {
		name: '',
		avatar: '',
		receiver_id: '',
		dialog_id: 0,
		status: 0,
		is_group: false
	},
	messages: [],
	beforeOpened: false,

	updateOpened: (opened: boolean) => set({ opened }),
	updateReceiverInfo: (info: any) => set({ receiver_info: { ...get().receiver_info, ...info } }),
	updateMessages: (message: PrivateChats) => {
		const { messages } = get()
		const index = messages.findIndex((v) => v.msg_id === message.msg_id)
		if (index === -1) {
			set({ messages: [...messages, message] })
		} else {
			set({ messages: messages.map((v) => (v.msg_id === message.msg_id ? message : v)) })
		}
	},
	initMessage: async (is_group, dialog_id, receiver_id) => {
		// console.log('initMessage', is_group, dialog_id, receiver_id)
		const messages = await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', dialog_id)
		const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', receiver_id)

		const receiver_info = {
			...get().receiver_info,
			...userInfo,
			dialog_id,
			is_group
		}

		// console.log('messages', messages, dialog_id, receiver_id)

		set({ messages, receiver_info })
	},
	updateBeforeOpened: (beforeOpened) => set({ beforeOpened })
}))
