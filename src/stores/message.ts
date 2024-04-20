import { create } from 'zustand'
import { MessageStore, MessageStoreOptions } from './type'
import cacheStore from '@/utils/cache'
import { emojiOrMore, msgSendType, tooltipType, updateCacheMessage } from '@/shared'
import useCacheStore from './cache'

export const defaultOptions: MessageStoreOptions = {
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
	selectedForwardUsers: [],
	isLoading: false,
	unreadList: [],
	isGroupAnnouncement: false,
	isEmojiFocus: false,
	isScrollBottom: true
}

const useMessageStore = create<MessageStore>((set, get) => ({
	...defaultOptions,

	init: async (options) => {
		const tableName = `${options.dialogId}`
		const allMessages = (await cacheStore.get(tableName)) ?? []

		// 添加到搜索消息表名中
		const cache = useCacheStore.getState()
		if (!cache.cacheSearchMessage.includes(tableName)) {
			cache.updateCacheSearchMessage(tableName)
		}
		const messages = allMessages.slice(-20)
		const total = cache.totalMessages.find((item) => item.dialog_id === options.dialogId)?.total ?? 0

		set({
			allMessages,
			messages,
			isNeedPull: !allMessages.length,
			tableName,
			total,
			...options
		})

		console.log('init message store', get())
	},
	update: async (options) => {
		set((state) => ({ ...state, ...options }))
	},
	createMessage: async (message, isCreateCacheMessage = true) => {
		const { allMessages, messages } = get()
		const newAllMessages = [...allMessages, message]
		set({ allMessages: newAllMessages, messages: [...messages, message] })

		if (isCreateCacheMessage) {
			const cacheStore = useCacheStore.getState()
			await cacheStore.addCacheMessage(message)
		}
	},
	updateMessage: async (message, isupdateCacheMessage = true) => {
		const { allMessages, messages } = get()
		const newAllMessages = allMessages.map((msg: any) =>
			msg?.msg_id === message?.msg_id || msg?.uid === message?.uid ? { ...msg, ...message } : msg
		)
		set({
			allMessages: newAllMessages,
			messages: newAllMessages.slice(-messages.length)
		})

		if (isupdateCacheMessage) {
			const cacheStore = useCacheStore.getState()
			await cacheStore.updateCacheMessage(message)
		}
	},
	deleteMessage: async (message) => {
		const { tableName, allMessages, messages, dialogId } = get()
		const newAllMessages = allMessages.filter((msg) => msg.msg_id !== message.msg_id || msg?.uid !== message?.uid)
		set({ allMessages: newAllMessages, messages: newAllMessages.slice(-messages.length) })
		await updateCacheMessage(tableName, newAllMessages, dialogId)
	},
	deleteAllMessage: async (dialogId) => {
		set({ messages: [], allMessages: [] })
		cacheStore.set(`${dialogId}`, [])
	},
	unshiftMessage: async () => {
		const { allMessages, messages } = get()
		// const cacheStore = useCacheStore.getState()
		// if (messages.length < allMessages.length && cacheStore.isSyncRemote) {
		// 	getRemoteMessage({
		// 		isGroup,
		// 		id: dialogId,
		// 		page_num: 1,
		// 		page_size: 20,
		// 		msg_id: allMessages[0]?.msg_id ?? 0
		// 	}).then((data) => {
		// 		const total = data?.total ?? 0
		// 		const msgs = data?.user_messages ?? data?.group_messages ?? []
		// 		const newMessages = [...msgs.reverse(), ...messages]
		// 		set({ total, messages: newMessages, allMessages: newMessages, isLoading: false })
		// 		cacheStore.set(`${dialogId}`, newMessages)
		// 	})
		// } else {
		const newMessages = allMessages.slice(-messages.length - 20)
		set({ messages: newMessages, total: allMessages.length, isLoading: false })
		// }
	},
	updateUnreadList: async (msgId) => {
		const { unreadList } = get()
		if (!unreadList.includes(msgId)) unreadList.push(msgId)
	},

	isEOF: () => {
		const { total, messages } = get()
		return messages.length >= total
	}
}))

export default useMessageStore
