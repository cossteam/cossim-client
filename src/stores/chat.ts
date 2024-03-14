import { create } from 'zustand'
import UserStore from '@/db/user'
import type { PrivateChats } from '@/types/db/user-db'
import { ChatStore, ChatStoreValue } from '@/types/store/chat'
import { messageFromServer } from '@/shared'
import { v4 as uuidv4 } from 'uuid'

const defaultStore: ChatStoreValue = {
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
	beforeJump: false,
	isAtBottom: false,
	allMessages: []
}

export const useChatStore = create<ChatStore>((set, get) => ({
	...defaultStore,

	updateBeforeOpened: (beforeOpened) => set({ beforeOpened }),
	updateIsAtBottom: (isAtBottom) => set({ isAtBottom }),
	updateReceiverInfo: (info: any) => set((state) => ({ receiver_info: { ...state.receiver_info, ...info } })),

	updateOpened: (opened: boolean) => {
		set({ opened })
		if (!opened) {
			const { updateBeforeOpened, updateBeforeJump } = get()
			updateBeforeOpened(false)
			updateBeforeJump(false)
		}
	},
	updateMessages: (message: PrivateChats) => {
		const { messages } = get()
		const index = messages.findIndex((v) => v.msg_id === message.msg_id)
		if (index === -1) {
			set({ messages: [...messages, message] })
		} else {
			set({ messages: messages.map((v) => (v.msg_id === message.msg_id ? message : v)) })
		}
	},
	initMessage: async (options) => {
		// const messages = await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', options.dialog_id)
		const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', options.receiver_id)
		const receiver_info = Object.assign({}, options, userInfo)

		// 从服务器上拉取消息
		await messageFromServer({
			id: options.receiver_id,
			is_group: options.is_group,
			page_size: 15,
			page_num: 1
		}).then((res: any) => {
			const data = res?.group_messages || res?.user_messages || []
			// if (!messages.length) {
			const newData = data.reverse().map((v: PrivateChats) => ({
				...v,
				uid: uuidv4()
			}))
			set({ messages: newData })
			// UserStore.bulkAdd(UserStore.tables.messages, newData)
			// } else {
			// 	// TODO: 对比两个数组的差异，更新本地数据库
			// }
		})

		set({ receiver_info, beforeOpened: true })
	},
	addMessages: (messages: PrivateChats[]) => {
		set((state) => ({ messages: [...state.messages, ...messages] }))
	},
	updateBeforeJump: (beforeJump: boolean) => set({ beforeJump }),
	destroy: () => set({ ...defaultStore })
}))
