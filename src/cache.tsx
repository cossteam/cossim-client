import { memo, useEffect } from 'react'
import useCacheStore from '@/stores/cache'
import { useLiveQuery } from 'dexie-react-hooks'
import storage from '@/storage'

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

    // useEffect(() => {
    //     cacheStore.update({ cacheContactList })
    //     return () => {
    //         cacheStore.update({ cacheContactList: [] })
    //     }
    // }, [cacheContactList])

    // useEffect(() => {
    //     cacheStore.update({ cacheGroupsList })
    //     return () => {
    //         cacheStore.update({ cacheGroupsList: [] })
    //     }
    // }, [cacheGroupsList])

    // useEffect(() => {
    //     cacheStore.update({ cacheRequestList })
    //     return () => {
    //         cacheStore.update({ cacheRequestList: [] })
    //     }
    // }, [cacheRequestList])

    return null
}

export default memo(Cache)
