import { create } from 'zustand'
import { MessageStore, MessageStoreOptions } from './type'
import cacheStore from '@/utils/cache'
// import useUserStore from './user'
import { getRemoteMessage } from '@/shared'

const defaultOptions: MessageStoreOptions = {
	messages: [],
	allMessages: [],
	dialogId: 0,
	receiverId: '',
	isAtBottom: true,
	receiverInfo: {},
	isNeedPull: true,
	isGroup: false
}

const useMessageStore = create<MessageStore>((set) => ({
	...defaultOptions,

	init: async (options) => {
		const allMessages = (await cacheStore.get(`message_${options.dialogId}`))?.messages ?? []

		const messages = allMessages.slice(-20)

		set({ allMessages, messages, isNeedPull: !allMessages.length, ...options })

		getRemoteMessage(options.isGroup, options.receiverId, 1, 1).then((data) => {
			console.log('getRemoteMessage', data)
		})
	},

	update: (options) => {
		set((state) => ({ ...state, ...options }))
	}
}))

export default useMessageStore
