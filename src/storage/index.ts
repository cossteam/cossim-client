import useUserStore from '@/stores/user'
import Dexie, { Table } from 'dexie'
import { injectable, Container } from 'inversify'
import GroupMessagesService from './services/group-messages'

export const TYPES = {
    Storage: Symbol.for('Storage')
}

@injectable()
class Storage extends Dexie {
    private_messages!: Table<Message>
    group_messages!: Table<Message>
    chatList!: Table<ChatData>

    constructor(name: string, version: number = 1) {
        super(name)
        this.version(version).stores({
            private_messages: '++id, sender, receiver, content, timestamp',
            group_messages: '++id, sender, group, content, timestamp',
            chatList: '++id, name, members, lastMessage, lastMessageTime'
        })
    }
}

export function createStorage(name: string = 'coss-storage', version: number = 1): Storage {
    const userId = useUserStore.getState().userId
    if (!userId) throw new Error('User id is not set')
    return new Storage(`${name}-${userId}`, version)
}

const container = new Container()

container.bind<Storage>(TYPES.Storage).to(Storage).inSingletonScope()

container.bind<GroupMessagesService>(GroupMessagesService).toSelf().inSingletonScope()

const groupMessagesService = container.get<GroupMessagesService>(GroupMessagesService)

export { groupMessagesService }
export default Storage
