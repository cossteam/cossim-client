import { getBehindMessageApi, getDialogListApi } from '@/api/msg'
import { getFriendListApi } from '@/api/relation'
import { QueryParams } from '@/types/api'
import { MESSAGE_SEND_STATE } from '@/utils/enum'
import { isGroupDialog } from '@/utils/message'
import { groupsToArray } from '@/utils/utils'

export async function getDialogList(params: Required<QueryParams>) {
    const res = await getDialogListApi(params)
    if (res.code !== 200) return
    const data = res.data.list
    storage.chat_list.bulkPut(res.data.list)
    getLastMessage(data)
    return res.data
}

export async function getFriendList() {
    const res = await getFriendListApi()
    if (res.code !== 200) return
    storage.contact_list.bulkPut(groupsToArray(res.data.list))
    return res.data
}

export async function getGroupList() {}

export async function getFirendRequestList() {}

export async function getGroupRequsetList() {}

export async function getLastMessage(data: ChatData[]) {
    const dialogList = data.map((item) => ({
        dialog_id: item.dialog_id,
        msg_id: 0
    }))
    const res = await getBehindMessageApi(dialogList)
    if (res.code !== 200) return

    const privateMessages = []
    const groupMessages = []

    for (const item of res.data) {
        const dialogId = item.dialog_id
        const messageList = item.messages.map((message: Message) => ({
            ...message,
            dialog_id: dialogId,
            msg_send_state: MESSAGE_SEND_STATE.SUCCESS
        }))
        const dialog = data.find((dialog) => dialog.dialog_id === dialogId)
        if (!dialog) continue

        if (isGroupDialog(dialog)) {
            groupMessages.push(...messageList)
        } else {
            privateMessages.push(...messageList)
        }
    }

    storage.private_messages.bulkPut(privateMessages)
    storage.group_messages.bulkPut(groupMessages)
    console.log('synchronize last message success')
}

export async function synchronize() {
    getDialogList({ page_num: 1, page_size: 30 })
    getFriendList()
    // getGroupList()
    getFirendRequestList()
    getGroupRequsetList()
}
