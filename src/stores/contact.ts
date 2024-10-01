import { create } from 'zustand'
import type { ContactsCacheStoreMethods, ContactsOptions, ContactsStore } from '@/types/store'
import { Contact, LetterContact } from '@/types/storage'
import { RELATION_STATUS } from '@/utils/enum'

const states: ContactsOptions = {
    cacheContactList: [],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = (set: any, get: any): ContactsCacheStoreMethods => ({
    update: async (options) => set(options),

    addContact: (contact: Contact) => set((state: ContactsOptions) => {
        console.log("Current contact list before update:", state.cacheContactList);
    
        const existingIndex = state.cacheContactList.findIndex(c => c.user_id === contact.user_id);
    
        let updatedList;
        if (existingIndex !== -1) {
            // 如果存在，更新联系人信息
            updatedList = [...state.cacheContactList];
            updatedList[existingIndex] = contact;
            console.log("Contact updated:", contact);
        } else {
            // 如果不存在，添加新联系人
            updatedList = [...state.cacheContactList, contact];
            console.log("New contact added:", contact);
        }
    
        console.log("Updated contact list after update:", updatedList);
        return { cacheContactList: updatedList };
    }),
    


    deleteContact: (userId: string) => set((state: ContactsOptions) => {
        // 过滤掉 userId 匹配的联系人
        const updatedContactList = state.cacheContactList.filter(contact => contact.user_id !== userId);
        return { cacheContactList: updatedContactList };
    }),    
    

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
        return state.cacheContactList.some((contactGroup: Contact) =>
            Object.values(contactGroup).flat().some(contact => contact.user_id === userId && contact.relation_status === RELATION_STATUS.BLOCKED)
        );
    },

    getContactInfo: (userId: string) => {
        const state = get();
        return findContactById(state.cacheContactList, userId);
    },
    getContacts: (): LetterContact[] => {
        const state = get();
        const groupedContacts: { [key: string]: Contact[] } = state.cacheContactList.reduce((acc: { [key: string]: Contact[] }, contact: Contact) => {
            if (!acc[contact.letter]) {
                acc[contact.letter] = [];
            }
            acc[contact.letter].push(contact);
            return acc;
        }, {} as { [key: string]: Contact[] });
        return Object.entries(groupedContacts).map(([letter, contacts]) => ({ [letter]: contacts }));
    },
})

const findContactById = (cacheContactList: Contact[], userId: string): Contact | undefined =>
    cacheContactList.flat().find(contact => contact.user_id === userId);

const contactStore = (set: any, get: any): ContactsStore => ({
    ...states,
    ...actions(set, get)
})

const useContactStore = create<ContactsStore>(contactStore)

export default useContactStore
