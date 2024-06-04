import { getDialogListApi } from '@/api/msg'
import { getFriendListApi } from '@/api/relation'
import { QueryParams } from '@/types/api'
import storage from '@/storage'

export async function getDialogList(params: Required<QueryParams>) {
    const res = await getDialogListApi(params)
    if (res.code !== 200) return
    console.log('getDialogList success', res.data)
    storage.chat_list.bulkPut(res.data.list)
    return res.data
}

export async function getFriendList() {
    const res = await getFriendListApi()
    if (res.code !== 200) return
    return res.data
}

export async function getGroupList() {}

export async function getFirendRequestList() {}

export async function getGroupRequsetList() {}

export async function getBlackList() {}

export async function synchronize() {
    getDialogList({ page_num: 1, page_size: 30 })
    getFriendList()
    getGroupList()
    getFirendRequestList()
    getGroupRequsetList()
    getBlackList()
}
