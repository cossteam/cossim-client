import { create } from 'zustand'
import type { ContactsCacheStoreMethods, ContactsOptions, ContactsStore } from '@/types/store'
import { Contact, ContactData } from '@/types/storage'
import { RELATION_STATUS } from '@/utils/enum'

const states: ContactsOptions = {
    cacheContactList: [],
    // cacheBlacklist: [],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = (set: any, get: any): ContactsCacheStoreMethods => ({
    update: async (options) => set(options),

    addContact: (contact: Contact) => set((state: ContactsOptions) => ({
        cacheContactList: [...state.cacheContactList, contact]
    })),

    deleteContact: (userId: string) => set((state: ContactsOptions) => ({
        cacheContactList: state.cacheContactList.map(contactGroup => Object.fromEntries(
            Object.entries(contactGroup).map(([key, contacts]) => [key, Array.isArray(contacts) ? contacts.filter(contact => contact.user_id !== userId) : contacts])
        )
        )
    })),

    isContact: (userId: string) => !!findContactById(get().cacheContactList, userId),

    addToBlacklist: (userId: string) => set((state: ContactsOptions) => {
        const userToBlacklist = findContactById(state.cacheContactList, userId);
        if (userToBlacklist) {
            return {
                cacheContactList: state.cacheContactList.map(contactGroup => Object.fromEntries(
                    Object.entries(contactGroup).map(([key, contacts]) => [key, Array.isArray(contacts) ? contacts.map(contact => contact.user_id === userId ? { ...contact, relation_status: RELATION_STATUS.BLOCKED } : contact) : contacts])
                )
                )
            };
        }
        return state;
    }),

    removeFromBlacklist: (userId: string) => set((state: ContactsOptions) => {
        return {
            cacheContactList: state.cacheContactList.map(contactGroup => Object.fromEntries(
                Object.entries(contactGroup).map(([key, contacts]) => [key, Array.isArray(contacts) ? contacts.map(contact => contact.user_id === userId ? { ...contact, relation_status: RELATION_STATUS.FRIEND } : contact) : contacts])
            )
            )
        };
    }),

    isInBlacklist: function (userId: string): boolean {
        const state = get();
        return state.cacheContactList.some((contactGroup: ContactData) =>
            Object.values(contactGroup).flat().some(contact => contact.user_id === userId && contact.relation_status === RELATION_STATUS.BLOCKED)
        );
    },
})

// 提取一个通用的用户查找函数，减少重复代码
const findContactById = (cacheContactList: ContactData[], userId: string): Contact | undefined =>
    cacheContactList.flatMap(contactGroup =>
        Object.values(contactGroup).flat()
    ).find(contact => contact.user_id === userId);

const contactStore = (set: any, get: any): ContactsStore => ({
    ...states,
    ...actions(set, get)
})

const useContactStore = create<ContactsStore>(contactStore)

export default useContactStore
