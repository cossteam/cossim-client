import { memo, useEffect } from 'react'
import useCacheStore from '@/stores/cache'
import { useLiveQuery } from 'dexie-react-hooks'
import storage from '@/storage'
import synchronize from '@/background/synchronize'
import { useAsyncEffect } from '@reactuses/core'

const Cache = () => {
    const cacheStore = useCacheStore()
    const cacheChatList = useLiveQuery(() => storage.chat_list.toArray(), [])
    const cacheContactList = useLiveQuery(() => storage.contact_list.toArray(), [])
    const cacheGroupsList = useLiveQuery(() => storage.groups_list.toArray(), [])
    const cacheRequestList = useLiveQuery(() => storage.request_list.toArray(), [])

    useEffect(() => {
        cacheStore.update({ cacheChatList, cacheContactList, cacheGroupsList, cacheRequestList })
        return () => {
            cacheStore.update({
                cacheChatList: [],
                cacheContactList: [],
                cacheGroupsList: [],
                cacheRequestList: []
            })
        }
    }, [cacheChatList, cacheContactList, cacheGroupsList, cacheRequestList])

    useAsyncEffect(
        async () => {
            synchronize.synchronize()
        },
        () => {},
        []
    )

    return null
}

export default memo(Cache)
