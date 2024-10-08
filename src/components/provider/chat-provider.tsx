import { ChatContext, ChatContextData, chatState } from '@/context/chat-context'
import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'

interface ChatProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

function ChatProvider({ children, className, ...props }: ChatProviderProps) {
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
            <div className={cn('flex flex-col h-full overflow-hidden', className)} {...props}>
                {children}
            </div>
        </ChatContext.Provider>
    )
}

export default ChatProvider
