import { create } from 'zustand'
import { MessageStore, MessageStoreOptions } from './type'
import cacheStore from '@/utils/cache'
import { CACHE_MESSAGE, emojiOrMore, msgSendType, tooltipType } from '@/shared'

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
	selectedMessages: [],
	content: '',
	draft: '',
	sendType: msgSendType.AUDIO,
	toolbarType: emojiOrMore.NONE,
	selectedEmojis: '',
	isClearContent: false,
	tableName: '',
	total: 0,
	placeholderHeight: 0,
	manualTipType: tooltipType.NONE,
	atAllUser: 0,
	atUsers: [],
	selectedForwardUsers: []
}

const useMessageStore = create<MessageStore>((set, get) => ({
	...defaultOptions,

	init: async (options) => {
		const tableName = CACHE_MESSAGE + `_${options.dialogId}`

		const allMessages = (await cacheStore.get(tableName)) ?? []

		// const cache = useCacheStore.getState()
		// 添加到搜索消息表名中
		// if (!cache.cacheSearchMessage.includes(tableName)) {
		// 	useCacheStore.getState().updateCacheSearchMessage([...cache.cacheSearchMessage, tableName])
		// }

		const messages = allMessages.slice(-15)

		set({ allMessages, messages, isNeedPull: !allMessages.length, tableName, ...options })

		// 获取远程消息
		// getRemoteMessage(options.isGroup, options.receiverId, 1, 100).then((data) => {
		// 	const total = data?.total ?? 0
		// 	const msgs = data?.user_messages ?? data?.group_messages ?? []

		// 	const diffData = msgs
		// 		.reverse()
		// 		// @ts-ignore
		// 		.filter((msg) => !allMessages.some((m) => m?.msg_id === msg?.msg_id))

		// 	if (diffData.length > 0) {
		// 		// const messages = diffData.concat(allMessages)
		// 		// set({ allMessages: messages, messages: messages.slice(-15) })
		// 		cacheStore.set(tableName, diffData)
		// 	}

		// 	set({ total })
		// })
	},

	update: (options) => {
		set((state) => ({ ...state, ...options }))
	},

	updateMessage: async (message, isPush = true) => {
		const { tableName, allMessages, messages } = get()
		const newAllMessages = isPush
			? [...allMessages, message]
			: allMessages.map((msg: any) => (msg.msg_id === message.msg_id ? { ...msg, ...message } : msg))

		set({ allMessages: newAllMessages, messages: newAllMessages.slice(-(messages.length + 1)) })
		cacheStore.set(tableName, newAllMessages)
	},

	deleteMessage: async (message) => {
		const { tableName, allMessages, messages } = get()
		const newAllMessages = allMessages.filter((msg) => msg.msg_id !== message.msg_id)

		console.log('deleteMessage', message, newAllMessages)

		set({ allMessages: newAllMessages, messages: newAllMessages.slice(-(messages.length + 1)) })
		await cacheStore.set(tableName, newAllMessages)
	}
}))

export default useMessageStore
