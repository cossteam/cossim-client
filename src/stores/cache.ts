import { create } from 'zustand'
import { CacheStore, CacheStoreOptions } from './type'
import cacheStore from '@/utils/cache'
import {
	CACHE_APPLY_COUNT,
	CACHE_CONTACTS,
	CACHE_DIALOGS,
	CACHE_GROUP,
	CACHE_KEYBOARD_HEIGHT,
	CACHE_MESSAGE,
	CACHE_SEARCH_MESSAGE,
	CACHE_SHARE_KEYS,
	CACHE_UNREAD_COUNT,
	arrayToGroups,
	groupsToArray
} from '@/shared'

const defaultOptions: CacheStoreOptions = {
	firstOpened: true,
	cacheDialogs: [],
	cacheContacts: [],
	cacheContactsObj: {},
	cacheGroup: [],
	cacheShareKeys: [],
	cacheSearchMessage: [],
	unreadCount: 0,
	applyCount: 0,
	keyboardHeight: 300
}

const useCacheStore = create<CacheStore>((set, get) => ({
	...defaultOptions,

	init: async () => {
		const cacheDialogs = (await cacheStore.get(CACHE_DIALOGS)) ?? []
		const cacheContacts = (await cacheStore.get(CACHE_CONTACTS)) ?? []
		const cacheShareKeys = (await cacheStore.get(CACHE_SHARE_KEYS)) ?? []
		const cacheSearchMessage = (await cacheStore.get(CACHE_SEARCH_MESSAGE)) ?? []
		const cacheGroup = (await cacheStore.get(CACHE_GROUP)) ?? []
		const unreadCount = (await cacheStore.get(CACHE_UNREAD_COUNT)) ?? 0
		const applyCount = (await cacheStore.get(CACHE_APPLY_COUNT)) ?? 0
		const keyboardHeight = (await cacheStore.get(CACHE_KEYBOARD_HEIGHT)) ?? 300

		// console.log(
		// 	'cacheContacts',
		// 	// cacheContacts,
		// 	groupsToArray(cacheContacts)
		// 	// arrayToGroups(groupsToArray(cacheContacts))
		// )

		set({
			cacheDialogs,
			cacheContacts: groupsToArray(cacheContacts),
			cacheShareKeys,
			cacheGroup,
			unreadCount,
			applyCount,
			keyboardHeight,
			cacheSearchMessage,
			cacheContactsObj: cacheContacts
		})
	},
	updateFirstOpened: (firstOpened) => set({ firstOpened }),
	updateCacheDialogs: async (cacheDialogs) => {
		await cacheStore.set(CACHE_DIALOGS, cacheDialogs)
		set({ cacheDialogs })
	},
	updateCacheUnreadCount: async (unreadCount) => {
		await cacheStore.set(CACHE_UNREAD_COUNT, unreadCount)
		set({ unreadCount })
	},
	updateCacheApplyCount: async (applyCount) => {
		await cacheStore.set(CACHE_APPLY_COUNT, applyCount)
		set({ applyCount })
	},
	updateKeyboardHeight: async (keyboardHeight) => {
		await cacheStore.set(CACHE_KEYBOARD_HEIGHT, keyboardHeight)
		set({ keyboardHeight })
	},
	updateCacheSearchMessage: async (tableName) => {
		const { cacheSearchMessage } = get()
		if (cacheSearchMessage.includes(tableName)) return
		set({ cacheSearchMessage })
		await cacheStore.set(CACHE_SEARCH_MESSAGE, cacheSearchMessage)
	},
	updateCacheMessage: async (cacheDialogs) => {
		const { updateCacheSearchMessage } = get()
		if (!cacheDialogs.length) return

		cacheDialogs?.map(async (item) => {
			const tableName = CACHE_MESSAGE + `_${item.dialog_id}`
			const messages = (await cacheStore.get(tableName)) ?? []

			// 如果没有消息就添加一个
			if (!messages.length) {
				cacheStore.set(tableName, [item?.last_message])
			}

			updateCacheSearchMessage(tableName)
		})
	},
	updateBehindMessage: async (behindMessages) => {
		behindMessages?.map(async (item) => {
			const tableName = CACHE_MESSAGE + `_${item.dialog_id}`
			const messages = (await cacheStore.get(tableName)) ?? []
			cacheStore.set(tableName, [...messages, ...item.msg_list])
		})
	},
	addCacheMessage: async (message) => {
		const tableName = CACHE_MESSAGE + `_${message.dialog_id}`
		const messages = (await cacheStore.get(tableName)) ?? []
		await cacheStore.set(tableName, [...messages, message])
	},
	updateCacheContacts: async (cacheContacts) => {
		await cacheStore.set(CACHE_CONTACTS, cacheContacts)
		set({ cacheContacts: groupsToArray(cacheContacts), cacheContactsObj: cacheContacts })
	},
	updateCacheContactsObj: async (cacheContacts) => {
		const cacheContactsObj = arrayToGroups(cacheContacts)
		await cacheStore.set(CACHE_CONTACTS, cacheContactsObj)
		console.log('cacheContactsObj', cacheContactsObj, cacheContacts)
		set({ cacheContacts, cacheContactsObj })
	}
}))

export default useCacheStore
