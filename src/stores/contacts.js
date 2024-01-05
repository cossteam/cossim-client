import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const contactsStore = (set) => ({
	contacts: [
		{
			id: '69f316b1-e992-43ab-8cc9-a14093cca5e0',
			avatar: 'mark-zuckerberg.jpg',
			name: 'Mark Zuckerberg',
			status: 'Life is good'
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
