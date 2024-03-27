import { create } from 'zustand'
import { MessageStore, MessageStoreOptions } from './type'
import cacheStore from '@/utils/cache'
import { CACHE_MESSAGE, emojiOrMore, msgSendType, tooltipType, updateCacheMessage } from '@/shared'
import useCacheStore from './cache'

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

		// 添加到搜索消息表名中
		const cache = useCacheStore.getState()
		if (!cache.cacheSearchMessage.includes(tableName)) {
			useCacheStore.getState().updateCacheSearchMessage(tableName)
		}

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

		console.log('init message store', options)
	},
	update: (options) => {
		set((state) => ({ ...state, ...options }))
	},
	createMessage: async (message) => {
		const { allMessages, messages } = get()
		const newAllMessages = [...allMessages, message]
		set({ allMessages: newAllMessages, messages: [...messages, message] })
	},
	updateMessage: async (message, dialogId, isPush = true) => {
		const { allMessages, messages, dialogId: currentDialog } = get()
		const tableName = CACHE_MESSAGE + `_${dialogId}`
		const isCurrentDialog = dialogId === currentDialog

		const tableMessages = isCurrentDialog ? allMessages : (await cacheStore.get(tableName)) ?? []

		const newAllMessages = isPush
			? [...tableMessages, message]
			: tableMessages.map((msg: any) => (msg?.msg_id === message?.msg_id ? { ...msg, ...message } : msg))

		// 转发给别人时不需要更新当前会话的消息
		if (isCurrentDialog) {
			set({ allMessages: newAllMessages, messages: newAllMessages.slice(-messages.length) })
		}

		await updateCacheMessage(tableName, newAllMessages)
	},
	deleteMessage: async (message) => {
		const { tableName, allMessages, messages } = get()
		const newAllMessages = allMessages.filter((msg) => msg.msg_id !== message.msg_id)
		set({ allMessages: newAllMessages, messages: newAllMessages.slice(-(messages.length + 1)) })
		await updateCacheMessage(tableName, newAllMessages)
	},
	deleteAllMessage: async (dialogId) => {
		const tableName = CACHE_MESSAGE + `_${dialogId}`
		cacheStore.set(tableName, [])
	}
}))

export default useMessageStore
