import { create } from 'zustand'
import {
	MESSAGE_MARK,
	MESSAGE_READ,
	MESSAGE_SEND,
	MESSAGE_TYPE,
	MessageBurnAfterRead,
	USER_ID,
	addMarkMessage,
	getMessageFromServer,
	// initMessage,
	updateDialogs
} from '@/shared'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
// import MsgService from '@/api/msg'
import { getCookie } from '@/utils/cookie'
// import { updateDatabaseMessage } from '@/shared'
// import CommonStore from '@/db/common'
// import { v4 as uuidv4 } from 'uuid'
// import { isEqual, omitBy, isEmpty, differenceBy } from 'lodash-es'
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
		console.log('initMessage', is_group, dialog_id, receiver_id)
	}
}))
