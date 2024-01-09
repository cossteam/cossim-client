import Dexie from 'dexie'

const dbService = new Dexie('COSSIM')

dbService.version(1).stores({
	// 联系人
	contacts: '++id, avatar, name, status',
	// 会话
	chats: '++id, avatar, name, unreadCount, lastMessage, time',
	// 消息
	messages: '++id'
})

// dbService.

export const db = dbService
console.log('IndexedDB Ready...')
