import { inject } from 'inversify'
import Storage, { TYPES } from '..'

class GroupMessagesService {
    private tableName = 'group_messages'

    constructor(@inject(TYPES.Storage) private readonly storage: Storage) {}

    getTableName() {
        return this.tableName
    }

    async find(groupId: string) {
        return this.storage.table(this.tableName).get(groupId)
    }

    async create(groupId: string, message: string) {
        return this.storage.table(this.tableName).bulkAdd([{ groupId, message }])
    }

    async update(groupId: string, message: string) {
        return this.storage.table(this.tableName).update(groupId, { message })
    }

    async delete(groupId: string) {
        return this.storage.table(this.tableName).delete(groupId)
    }

    async clear() {
        return this.storage.table(this.tableName).clear()
    }

    async getAll() {
        return this.storage.table(this.tableName).toArray()
    }
}

export default GroupMessagesService
