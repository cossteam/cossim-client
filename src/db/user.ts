import Dexie, { Table } from 'dexie'
import type { ApplyList, DialogsList, Friends, GroupChats, Groups, PrivateChats, ClientPGPKeys } from '@/types/db/user-db'
import { ServiceImpl, USER_ID, COMMON_DATA_BASE_NAME } from '@/shared'
import { getCookie } from '@/utils/cookie'

/**
 ** 注意: 该数据库字段可以随意添加或者删除,这里只给出一些基础的字段,需要的请自行添加,无需更改以下字段
 */
class UserStoreImpl extends Dexie {
	dialogs!: Table<DialogsList>
	friends!: Table<Friends>
	groups!: Table<Groups>
	private_chats!: Table<PrivateChats>
    group_chats!: Table<GroupChats>
	apply_list!: Table<ApplyList>
	client_pgp_keys!: Table<ClientPGPKeys>

	constructor(name: string, version: number = 1) {
		super(name)
		this.version(version).stores({
			dialogs: '++id, &dialog_id, &group_id, user_id, &msg_id',
			friends: '++id, &dialog_id, &user_id, email, tel, nickname',
			groups: '++id, &dialog_id, &group_id',
			private_chats:
				'++id, dialog_id, &msg_id, content, created_at, is_burn_after_reading, is_label, is_read, read_at, receiver_id, replay_id, sender_id, type',
			group_chats: '++id, dialog_id, &msg_id',
			apply_list: '++id',
            client_pgp_keys: '++id, &dialog_id, server_public_Key, private_key, public_key, revocation_certificate'
		})
	}
}

const UserStore = new ServiceImpl({
	db: new UserStoreImpl(COMMON_DATA_BASE_NAME + `_${getCookie(USER_ID)}`)
})

export default UserStore
