import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const chatsStore = (set) => ({
	chats: [
		{
			userId: 'f0ac5c48-23d7-4299-b479-88c883b0e8e9',
			messages: [
				{
					text: '今晚有空吗，一起吃个饭？',
					type: 'sent',
					date: new Date().getTime() - 0.5 * 60 * 60 * 1000
				},
				{
					text: '6点钟可以不',
					type: 'received',
					date: new Date().getTime() - 2 * 60 * 60 * 1000
				}
			]
		},
		{
			userId: 'cc4e8ba2-ecc9-464c-b016-01d95bc52b72',
			messages: [
				{
					text: '今晚有空吗，一起吃个饭？',
					type: 'received',
					date: new Date().getTime() - 0.5 * 60 * 60 * 1000
				},
				{
					text: '6点钟可以不',
					type: 'sent',
					date: new Date().getTime() - 2 * 60 * 60 * 1000
				}
			]
		}
	],
	updateChats: (chats) => set({ chats })
})

// 本地存储 TODO: 改为本地数据库
export const useChatsStore = create(
	devtools(
		persist(chatsStore, {
			name: 'chatsStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
