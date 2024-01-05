import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const chatsStore = (set) => ({
	chats: [
		{
			userId: '69f316b1-e992-43ab-8cc9-a14093cca5e0',
			messages: [
				{
					text: '消息内容',
					type: 'sent',
					date: new Date().getTime() - 2 * 60 * 60 * 1000
				},
				{
					text: 'Huge Facebook update is in the progress!',
					type: 'received',
					date: new Date().getTime() - 1 * 60 * 60 * 1000
				},
				{
					text: 'Congrats! 🎉',
					type: 'sent',
					date: new Date().getTime() - 0.5 * 60 * 60 * 1000
				}
			]
		}
	],
	updateChats: (chats) => set({ chats })
})

export const useChatsStore = create(
	devtools(
		persist(chatsStore, {
			name: 'chatsStore-storage',
			storage: createJSONStorage(() => localStorage) // 本地存储 TODO: 改为本地数据库
		})
	)
)
