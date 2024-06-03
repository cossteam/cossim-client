import storage from '@/storage'

function useCache() {
    const cacheContactList = storage.contact_list.toArray()
    const cacheGroupList = storage.groups_list.toArray()

    return {
        cacheContactList,
        cacheGroupList
    }
}

export default useCache
