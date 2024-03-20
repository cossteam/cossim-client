import { create } from 'zustand'
import { MessageStore, MessageStoreOptions } from './type'
import cacheStore from '@/utils/cache'
// import useUserStore from './user'
import { getRemoteMessage, tooltipType } from '@/shared'

const defaultOptions: MessageStoreOptions = {
	messages: [],
	allMessages: [],
	dialogId: 0,
	receiverId: '',
	isAtBottom: true,
	receiverInfo: {},
	isNeedPull: true,
	isGroup: false,
	container: null,
	tipType: tooltipType.NONE,
	selectedMessage: {},
	selectedMessages: []
}

const useMessageStore = create<MessageStore>((set) => ({
	...defaultOptions,

	init: async (options) => {
		const allMessages = (await cacheStore.get(`dialog_${options.dialogId}`)) ?? []

		const messages = allMessages.slice(-20)

		// console.log("messages",messages);

		set({ allMessages, messages, isNeedPull: !allMessages.length, ...options })

		// 获取远程消息
		getRemoteMessage(options.isGroup, options.receiverId, 1, 30).then((data) => {
			const total = data?.total ?? 0
			const msgs = data?.user_messages ?? data?.group_messages ?? []
			console.log('getRemoteMessage', total, msgs)
			cacheStore.set(`dialog_${options.dialogId}`, msgs)
		})
	},

	update: (options) => {
		set((state) => ({ ...state, ...options }))
	}
}))

export default useMessageStore
