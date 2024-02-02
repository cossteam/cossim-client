// import Dexie from 'dexie'
import { getStorage } from '@/utils/stroage'
import { dbService as service } from '@/utils/db'
import { BASE_VERSION } from './constants'

const state = getStorage()?.state?.user

// COSSIM 客户端数据库
const user_id = state?.user_id || state?.dbName || 'DB'

// export const PRIMARY_KEY = 'user_id'

/**
 * 数据库版本号
 * Dexie.semVer	Dexie.version
 * "1.0.0"      1.0
 * "1.0.1"      1.0001
 * "1.1.0"      1.01
 * "1.3.4"      1.0304
 */
// const WEBDB_VERSION = 1.0001 // 对表结构进行修改时需要进版本号修改
const BASE_KEYS = '&user_id, data'

// contacts, chats, messages
const TABLE_NAMES = ['users', 'msgs']

const TABLES = {
	// 建立唯一索引在 字段 前添加 & 符号
	// 联系人
	contacts: `++id, group, &user_id, avatar, name, nick_name, email, signature, status, tel, &dialog_id`,
	// 会话
	chats: `
		++id,
		&dialog_id,
		user_id,
		dialog_type,
		dialog_name,
		dialog_avatar,
		dialog_unread_count,
		msg_type,
		last_message,
		sender_id,
		send_time,
		msg_id`,
	// 用户私聊消息
	user_msgs: `++id, &msg_id, msg_is_self, msg_read_status ,msg_type, msg_content, msg_send_time, meg_sender_id, dialog_id, msg_send_state, replay_msg_id`,
	// 用户群聊消息
	group_msgs: `++id, &msg_id, msg_is_self, msg_read_status ,msg_type, msg_content, msg_send_time, meg_sender_id, group_id, dialog_id, msg_send_state, replay_msg_id`,
	// 会话列表
	// chats_list: `++id, &dialog_id, dialog_type, dialog_name, dialog_avatar, dialog_unread_count, last_message, sender_id, send_time, &msg_id`,
	// 好友列表
	friends_list: `++id, &user_id, nick_name, avatar, signature, tel, email, status, publicKey, shareKey, &dialog_id, is_black, group`,
	// 群聊列表：	
	// 	自增id 	| 群聊id | 群聊名称 | 群聊头像 	| 群聊人数 | 是否公开 | 群聊id | 是否禁言 | 是否管理员 | 是否群主 | 是否锁定 | 群聊备注 | 群聊类型
	//  是否置顶 | 是否免打扰 | 是否被禁言 | 群聊公告 | 群聊公告时间 | 群聊公告发送者 | 群聊公告发送者id | 群聊公告发送者头像 | 群聊公告发送者昵称 
	//  群聊描述
	groups_list: `
		++id, &group_id, group_name, group_avatar, total_count, is_public, &dialog_id, is_muted, is_admin, is_lord, is_locked, group_remark, group_type,
		is_top, is_disturb, is_banned, group_notice, group_notice_time, group_notice_sender, group_notice_sender_id, group_notice_sender_avatar, group_notice_sender_nickname,
		group_description
	`,
	// TODO：
	...Object.assign({}, ...TABLE_NAMES.map((table) => ({ [table]: BASE_KEYS })))
}

const userService = new service({
	name: 'COSS_' + state?.user_id || 'DB',
	version: BASE_VERSION,
	tables: TABLES,
	primary_key: 'user_id'
})

export { userService as dbService }

export default userService
