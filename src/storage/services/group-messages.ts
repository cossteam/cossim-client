import { inject } from 'inversify'
import Storage from '..'

class GroupMessagesService {
    private tableName = 'group_messages'

    constructor(@inject(Storage) private storage: Storage) {}

    getTableName() {
        return this.tableName
    }

    async findOneById(groupId: string) {
        return this.storage.table(this.tableName).get(groupId)
    }

    async create(groupId: string, message: string) {
        return this.storage.table(this.tableName).bulkAdd([{ groupId, message }])
    }
}

export default GroupMessagesService
