import { createContext } from 'react'

export interface ChatState {
    isDrawerOpen: boolean
}

export interface ChatAction {
    update: (options: Partial<ChatState>) => void
}

export interface ChatContextData {
    isDrawerOpen: boolean
    update: (options: Partial<ChatState>) => void
}

export const chatState: ChatState = {
    isDrawerOpen: true
}

export const chatAction: ChatAction = {
    update: () => {}
}

export const ChatContext = createContext<ChatContextData>({
    ...chatState,
    ...chatAction
})
