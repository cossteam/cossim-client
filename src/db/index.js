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
	contacts: '++id, group, &user_id, nick_name, email, signature, status',
	// 会话
	chats: '++id, avatar, name, unreadCount, lastMessage, time',
	// 消息
	messages: '++id, chatId, content, time, type, userId'
})

export default WebDB
console.log('IndexedDB Ready...')
