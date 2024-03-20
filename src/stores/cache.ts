import { create } from 'zustand'
import { CacheStore, CacheStoreOptions } from './type'
import cacheStore from '@/utils/cache'

const defaultOptions: CacheStoreOptions = {
	firstOpened: true,
	cacheDialogs: [],
	cacheContacts: [],
	cacheGroup: [],
	cacheShareKeys: [],
	unreadCount: 0,
	applyCount: 0,
	keyboardHeight: 300
}

const useCacheStore = create<CacheStore>((set) => ({
	...defaultOptions,

	init: async () => {
		const cacheDialogs = (await cacheStore.get('cacheDialogs')) ?? []
		const cacheContacts = (await cacheStore.get('cacheContacts')) ?? []
		const cacheShareKeys = (await cacheStore.get('cacheShareKey')) ?? []
		const cacheGroup = (await cacheStore.get('cacheGroup')) ?? []

		const unreadCount = (await cacheStore.get('unreadCount')) ?? 0
		const applyCount = (await cacheStore.get('applyCount')) ?? 0
		const keyboardHeight = (await cacheStore.get('keyboardHeight')) ?? 300

		set({ cacheDialogs, cacheContacts, cacheShareKeys, cacheGroup, unreadCount, applyCount, keyboardHeight })
	},

	updateFirstOpened: (firstOpened) => set({ firstOpened }),

	updateCacheDialogs: async (cacheDialogs) => {
		await cacheStore.set('cacheDialogs', cacheDialogs)
		set({ cacheDialogs })
	},

	updateUnreadCount: async (unreadCount) => {
		await cacheStore.set('unreadCount', unreadCount)
		set({ unreadCount })
	},

	updateKeyboardHeight: async (keyboardHeight) => {
		await cacheStore.set('keyboardHeight', keyboardHeight)
		set({ keyboardHeight })
	}
}))

export default useCacheStore
