//! 现在暂时存留，后续可能会使用
import { dbService } from '@/utils/db'
import { BASE_VERSION, BASE_KEYS } from './constants'
import { getStorage } from '@/utils/stroage'

const state = getStorage()?.state?.user


// 表名 会话列表，联系人列表，消息列表
const TABLE_NAMES = ['chats', 'contacts', 'msgs']

// 数据表
const TABLES = Object.assign({}, ...TABLE_NAMES.map((table) => ({ [table]: BASE_KEYS })))

const userService = new dbService({
	name: 'COSS_' + state?.user_id || 'DB',
	version: BASE_VERSION,
	tables: TABLES,
	primary_key: 'user_id'
})

export default userService
