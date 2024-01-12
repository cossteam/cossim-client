import Dexie from 'dexie'

// COSSIM 客户端数据库
const WebDB = new Dexie('COSSIM')

/**
 * 数据库版本号
 * Dexie.semVer	Dexie.version
 * "1.0.0"      1.0
 * "1.0.1"      1.0001
 * "1.1.0"      1.01
 * "1.3.4"      1.0304
 */
const WEBDB_VERSION = 1.0 // 对表结构进行修改时需要进版本号修改

WebDB.version(WEBDB_VERSION).stores({
	// 建立唯一索引在 字段 前添加 & 符号
	// 联系人
	contacts: '++id, group, &user_id, avatar, name, nick_name, email, signature, status',
	// 会话
	chats: '++id, &dialog_id, user_id, dialog_type, dialog_name, dialog_avatar, dialog_unread_count, msg_type, last_message, sender_id, send_time, msg_id',
	// 消息：send_state(客户端消息发送时状态)：'sending' => 'ok' or 'err'
	messages:
		'++id, msg_id, sender_id, receiver_id, content, content_type, type, reply_id, read_at, created_at, dialog_id, send_state',
	keypairs:`
		++id,
		sender_id,
		sender_name,
		sender_device_id,
		signed_pre_key,
		sender_identity_key,
		sender_pre_key_id,
		sender_public_key,
		sender_registration_id,
		sender_signed_pre_key,
		sender_signature
	`
})

export default WebDB
console.log('IndexedDB Ready...')
