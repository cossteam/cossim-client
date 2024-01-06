import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const contactsStore = (set) => ({
	contacts: [
		{
			id: '09896ad3-8f78-49ec-80c2-ecf33a8db3f5',
			avatar: 'mark-zuckerberg.jpg',
			name: 'xm',
			status: 'Life is good'
		},
		{
			id: '334f4b6e-d731-4428-98f8-9b624eed6e9f',
			avatar: 'tim-cook.jpg',
			name: 'feng',
			status: 'I like apples 🍎'
		}
	],
	updateContacts: (contacts) => set({ contacts })
})

export const useContactsStore = create(
	devtools(
		persist(contactsStore, {
			name: 'contactsStore-storage',
			storage: createJSONStorage(() => localStorage) // 本地存储 TODO: 改为本地数据库
		})
	)
)
