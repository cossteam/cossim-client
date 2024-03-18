import { create } from 'zustand'
import { CacheStore, CacheStoreOptions } from './type'
import cacheStore from '@/utils/cache'

const defaultOptions: CacheStoreOptions = {
	firstOpened: true,
	cacheDialogs: [],
	cacheContacts: [],
	cacheShareKeys: []
}

const useCacheStore = create<CacheStore>((set) => ({
	...defaultOptions,
	
	init: async () => {
		const cacheDialogs = (await cacheStore.get('cacheDialogs')) ?? []
		const cacheContacts = (await cacheStore.get('cacheContacts')) ?? []
		const cacheShareKeys = (await cacheStore.get('cacheShareKey')) ?? []
		set({ cacheDialogs, cacheContacts, cacheShareKeys })
	},

	updateFirstOpened: (firstOpened) => set({ firstOpened }),

	updateCacheDialogs: async (cacheDialogs) => {
		await cacheStore.set('cacheDialogs', cacheDialogs)
		set({ cacheDialogs })
	}
}))

export default useCacheStore
