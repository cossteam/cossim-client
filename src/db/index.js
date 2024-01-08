import Dexie from 'dexie'

const dbService = new Dexie('COSSIM')

dbService.version(1).stores({
	// 联系人
	contacts: '',
    // 会话
    chats: '++id, avatar, name, unreadCount, lastMessage, time',
    // 消息
    messages: ''
})

dbService.po

export const db = dbService
console.log('IndexedDB Ready...')
