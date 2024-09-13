import { ChatContext, ChatContextData, chatState } from '@/context/chat-context'
import { useCallback, useState } from 'react'

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState(chatState)

    const update: ChatContextData['update'] = useCallback(
        (options) => {
            setState((prev) => ({ ...prev, ...options }))
        },
        [state]
    )

    return (
        <ChatContext.Provider
            value={{
                ...state,
                update
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider
