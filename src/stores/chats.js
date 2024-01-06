import { create } from 'zustand'
// import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const chatsStore = (set) => ({
	chats: [
		{
			userId: 'f0ac5c48-23d7-4299-b479-88c883b0e8e9',
			messages: [
				{
					text: '与xm消息内容',
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
		},
		{
			userId: 'cc4e8ba2-ecc9-464c-b016-01d95bc52b72',
			messages: [
				{
					text: '与feng的消息内容',
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

export const useChatsStore = create(chatsStore)
