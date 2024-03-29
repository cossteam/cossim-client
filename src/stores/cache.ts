import { create } from 'zustand'
import { CacheStore, CacheStoreOptions } from './type'
import cacheStore from '@/utils/cache'
import {
	CACHE_APPLY_COUNT,
	CACHE_CONTACTS,
	CACHE_DIALOGS,
	CACHE_GROUP,
	CACHE_KEYBOARD_HEIGHT,
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
	keyboardHeight: 417,
	friendApply: [],
	groupApply: []
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
	updateBehindMessage: async (behindMessages) => {
		behindMessages?.map(async (item) => {
			const tableName = `${item.dialog_id}`
			const messages = (await cacheStore.get(tableName)) ?? []
			cacheStore.set(tableName, [...messages, ...item.msg_list])
		})
	},
	addCacheMessage: async (message) => {
		const tableName = `${message.dialog_id}`
		const messages = (await cacheStore.get(tableName)) ?? []
		await cacheStore.set(tableName, [...messages, message])
	},
	updateCacheMessage: async (message) => {
		const tableName = `${message.dialog_id}`
		const allMessages = (await cacheStore.get(tableName)) ?? []
		const messages = allMessages.map((item: any) =>
			item?.msg_id === message?.msg_id || item?.uid === message?.uid ? { ...item, ...message } : item
		)

		await cacheStore.set(tableName, messages)
	},
	updateCacheContacts: async (cacheContacts) => {
		await cacheStore.set(CACHE_CONTACTS, cacheContacts)
		set({ cacheContacts: groupsToArray(cacheContacts), cacheContactsObj: cacheContacts })
	},
	updateCacheContactsObj: async (cacheContacts) => {
		const cacheContactsObj = arrayToGroups(cacheContacts)
		await cacheStore.set(CACHE_CONTACTS, cacheContactsObj)
		set({ cacheContacts, cacheContactsObj })
	},
	update: async (options) => {
		return set((state: CacheStoreOptions) => ({ ...state, ...options }))
	}
}))

export default useCacheStore
