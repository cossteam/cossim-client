import { create } from 'zustand'
import type { CacheOptions, CacheStore, CacheStoreMethods } from '@/types/store'

const states: CacheOptions = {
    cacheChatList: [],
    cacheContactList: [],
    cacheGroupsList: [],
    cacheMessageUnread: 0,
    cacheRequestList: []
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = (set: any, _get: any): CacheStoreMethods => ({
    update: async (options) => set(options)
})

const cacheStore = (set: any, get: any): CacheStore => ({
    ...states,
    ...actions(set, get)
})

const useCacheStore = create<CacheStore>(cacheStore)

export default useCacheStore
