import Dexie, { Table } from 'dexie'
import { COMMON_DATA_BASE_NAME } from '@/shared'
import type { UserDataBase } from '@/types/db/common-db'
import { ServiceImpl } from '@/shared/db'

class CommonStoreImpl extends Dexie {
	users!: Table<UserDataBase>

	constructor(name: string, version: number = 1) {
		super(name)
		this.version(version).stores({
			users: '++id, &user_id, account, keyPair, device_id, device_info, other_info'
		})
	}
}

/**
 * @deprecated 已废弃，请使用最新的 Api，在 stores 目录下
 */
const CommonStore = new ServiceImpl({
	db: new CommonStoreImpl(COMMON_DATA_BASE_NAME)
})

export default CommonStore
/*  */
