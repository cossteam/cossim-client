import { create } from 'zustand'
import type { MessagesOptions, MessagesStore, MessagesStoreMethods } from '@/types/store'

const states: MessagesOptions = {
    isGroup: false,
    chatInfo: null,
    receiverId: '',
    draft: ''
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = (set: any, _get: any): MessagesStoreMethods => ({
    update: async (options) => set(options)
})

const messagesStore = (set: any, get: any): MessagesStore => ({
    ...states,
    ...actions(set, get)
})

const useMessagesStore = create<MessagesStore>(messagesStore)

export default useMessagesStore
