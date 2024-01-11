import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const chatsStore = (set) => ({
	chats: [
		{
			userId: '09896ad3-8f78-49ec-80c2-ecf33a8db3f5',
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
			userId: '334f4b6e-d731-4428-98f8-9b624eed6e9f',
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

export const useChatsStore = create(
	devtools(
		persist(chatsStore, {
			name: 'chatsStore-storage',
			storage: createJSONStorage(() => localStorage)
		})
	)
)
