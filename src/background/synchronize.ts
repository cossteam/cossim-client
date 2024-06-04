import { getDialogListApi } from '@/api/msg'
import { getFriendListApi } from '@/api/relation'
import { QueryParams } from '@/types/api'
import useCacheStore from '@/stores/cache'
import { CacheStore } from '@/types/store'
import storage from '@/storage'

class Synchronize {
    private cache: CacheStore

    constructor() {
        this.cache = useCacheStore.getState()
    }

    async getDialogList(params: Required<QueryParams>) {
        const res = await getDialogListApi(params)
        if (res.code !== 200) return
        console.log('getDialogList success', res.data)
        storage.chat_list.bulkPut(res.data.list)
        return res.data
    }

    async getFriendList() {
        const res = await getFriendListApi()
        if (res.code !== 200) return
        return res.data
    }

    async getGroupList() {}

    async getFirendRequestList() {}

    async getGroupRequsetList() {}

    async getBlackList() {}

    async synchronize() {
        this.getDialogList({ page_num: 1, page_size: 30 })
        this.getFriendList()
        this.getGroupList()
        this.getFirendRequestList()
        this.getGroupRequsetList()
        this.getBlackList()
    }
}

const synchronize = new Synchronize()

export default synchronize
