import { create } from 'zustand'
import { GlobalStore } from './type'
import cacheStore from '@/cache'

const globalStore = (set: any) => ({
	cachesMessages: [],
	cachesChats: [],
	cachesContacts: [],
	init: async () => {
		const cachesMessages = await cacheStore.get('cachesMessages')
		const cachesChats = await cacheStore.get('cachesChats')
		const cachesContacts = await cacheStore.get('cachesContacts')
		
		set({ cachesMessages, cachesChats, cachesContacts })
	}
})

const useGlobalStore = create<GlobalStore>(globalStore)

export default useGlobalStore
