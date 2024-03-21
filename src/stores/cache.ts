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
	CACHE_UNREAD_COUNT
} from '@/shared'

const defaultOptions: CacheStoreOptions = {
	firstOpened: true,
	cacheDialogs: [],
	cacheContacts: [],
	cacheGroup: [],
	cacheShareKeys: [],
	cacheSearchMessage: [],
	unreadCount: 0,
	applyCount: 0,
	keyboardHeight: 300
}

const useCacheStore = create<CacheStore>((set) => ({
	...defaultOptions,

	init: async () => {
		const cacheDialogs = (await cacheStore.get(CACHE_DIALOGS)) ?? []
		const cacheContacts = (await cacheStore.get(CACHE_CONTACTS)) ?? []
		const cacheShareKeys = (await cacheStore.get(CACHE_SHARE_KEYS)) ?? []
		const cacheGroup = (await cacheStore.get(CACHE_GROUP)) ?? []
		const cacheSearchMessage = (await cacheStore.get(CACHE_SEARCH_MESSAGE)) ?? []

		const unreadCount = (await cacheStore.get(CACHE_UNREAD_COUNT)) ?? 0
		const applyCount = (await cacheStore.get(CACHE_APPLY_COUNT)) ?? 0
		const keyboardHeight = (await cacheStore.get(CACHE_KEYBOARD_HEIGHT)) ?? 300

		set({
			cacheDialogs,
			cacheContacts,
			cacheShareKeys,
			cacheGroup,
			unreadCount,
			applyCount,
			keyboardHeight,
			cacheSearchMessage
		})
	},

	updateFirstOpened: (firstOpened) => set({ firstOpened }),

	updateCacheDialogs: async (cacheDialogs) => {
		await cacheStore.set(CACHE_DIALOGS, cacheDialogs)
		set({ cacheDialogs })
	},

	updateUnreadCount: async (unreadCount) => {
		await cacheStore.set(CACHE_UNREAD_COUNT, unreadCount)
		set({ unreadCount })
	},

	updateKeyboardHeight: async (keyboardHeight) => {
		await cacheStore.set(CACHE_KEYBOARD_HEIGHT, keyboardHeight)
		set({ keyboardHeight })
	},

	updateCacheSearchMessage: async (cacheSearchMessage) => {
		await cacheStore.set(CACHE_SEARCH_MESSAGE, cacheSearchMessage)
		set({ cacheSearchMessage })
	}
}))

export default useCacheStore
