import useUserStore from '@/stores/user'
import type { FriendData, GroupData, RequestData } from '@/types/storage'
import Dexie, { Table } from 'dexie'

class Storage extends Dexie {
    private_messages!: Table<Message>
    group_messages!: Table<Message>
    chat_list!: Table<ChatData>
    request_list!: Table<RequestData>
    friends!: Table<FriendData>
    groups!: Table<GroupData>

    constructor(name: string, version: number = 1) {
        super(name)
        this.version(version).stores({
            private_messages: '++id, msg_id, dialog_id, content, type, sender_id, receiver_id',
            group_messages: '++id, msg_id, dialog_id, content, type, sender_id, receiver_id, group_id',
            chat_list: '++id, dialog_id, dialog_name, dialog_avatar, top_at, last_message',
            request_list: '++id, request_id, dialog_id', // TODO: add more fields
            friends: '++id, user_id', // TODO: add more fields
            groups: '++id, group_id' // TODO: add more fields
        })
    }
}

export function createStorage(name: string = 'coss-storage', version: number = 1): Storage {
    const userId = useUserStore.getState().userId
    if (!userId) throw new Error('User id is not set')
    return new Storage(`${name}-${userId}`, version)
}

export default Storage
