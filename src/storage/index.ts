import useUserStore from '@/stores/user'
import type { ContactData, GroupData, RequestData } from '@/types/storage'
import Dexie, { Table } from 'dexie'

class Storage extends Dexie {
    private_messages!: Table<Message>
    group_messages!: Table<Message>
    chat_list!: Table<ChatData>
    request_list!: Table<RequestData>
    contact_list!: Table<ContactData>
    groups_list!: Table<GroupData>

    constructor(name: string, version: number = 1) {
        super(name)
        this.version(version).stores({
            private_messages: '++id, msg_id, dialog_id, content, type, sender_id, receiver_id',
            group_messages: '++id, msg_id, dialog_id, content, type, sender_id, receiver_id, group_id',
            chat_list: '++id, dialog_id, dialog_name, dialog_avatar, top_at, last_message',
            request_list: '++id, request_id, dialog_id', // TODO: add more fields
            contact_list: '++id, user_id', // TODO: add more fields
            groups_list: '++id, group_id' // TODO: add more fields
        })
    }
}

export function createStorage(name: string = 'coss-storage', version: number = 1): Storage {
    const userId = useUserStore.getState().userId
    if (!userId) throw new Error('User id is not set')
    return new Storage(`${name}-${userId}`, version)
}

const storage = createStorage()

export default storage
