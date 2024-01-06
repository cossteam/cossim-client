import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

const contactsStore = (set) => ({
	contacts: [
		{
			id: 'f0ac5c48-23d7-4299-b479-88c883b0e8e9',
			avatar: 'mark-zuckerberg.jpg',
			name: 'xm',
			status: 'Life is good'
		},
        {
            id: 'cc4e8ba2-ecc9-464c-b016-01d95bc52b72',
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
