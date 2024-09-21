import { create } from 'zustand'
import type { CacheOptions, CacheStore, CacheStoreMethods } from '@/types/store'
import { Contact, ContactData } from '@/types/storage';

const states: CacheOptions = {
    cacheChatList: [],
    cacheContactList: [],
    cacheGroupsList: [],
    cacheMessageUnread: 0,
    cacheRequestList: [],
    cacheBlacklist: [],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = (set: any, get: any): CacheStoreMethods => ({
    update: async (options) => set(options),

    addContact: (contact: Contact) => set((state: CacheOptions) => ({
        cacheContactList: [...state.cacheContactList, contact]
    })),

    deleteContact: (userId: string) => set((state: CacheOptions) => ({
        cacheContactList: state.cacheContactList.map(contactGroup => Object.fromEntries(
            Object.entries(contactGroup).map(([key, contacts]) => [key, Array.isArray(contacts) ? contacts.filter(contact => contact.user_id !== userId) : contacts]
            )
        )
        )
    })),

    isContact: (userId: string) => !!findContactById(get().cacheContactList, userId),

    addToBlacklist: (userId: string) => set((state: CacheOptions) => {
        const userToBlacklist = findContactById(state.cacheContactList, userId);
        if (userToBlacklist && !state.cacheBlacklist.some((user: Contact) => user.user_id === userId)) {
            get().deleteContact(userId);
            return { cacheBlacklist: [...state.cacheBlacklist, userToBlacklist] };
        }
        return state;
    }),

    removeFromBlacklist: (userId: string) => set((state: CacheOptions) => {
        const userToRemove = state.cacheBlacklist.find((user: Contact) => user.user_id === userId);
        if (userToRemove) {
            get().addContact(userToRemove);
            return { cacheBlacklist: state.cacheBlacklist.filter((user: Contact) => user.user_id !== userId) };
        }
        return state;
    }),

    isInBlacklist: function (userId: string): boolean {
        const state = get();
        return state.cacheBlacklist.some((user: Contact) => user.user_id === userId);
    },

    getUserInfo: async (userId: string) => {
        return undefined;
    },
  
})

// 提取一个通用的用户查找函数，减少重复代码
const findContactById = (cacheContactList: ContactData[], userId: string): Contact | undefined => 
    cacheContactList.flatMap(contactGroup => 
        Object.values(contactGroup).flat()
    ).find(contact => contact.user_id === userId);

const cacheStore = (set: any, get: any): CacheStore => ({
    ...states,
    ...actions(set, get)
})

const useCacheStore = create<CacheStore>(cacheStore)

export default useCacheStore
