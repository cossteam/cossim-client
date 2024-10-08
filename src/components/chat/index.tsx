import ChatProvider from '@/components/provider/chat-provider'
import ChatFooter from './chat-footer/chat-footer'
import ChatHeader from './chat-header/chat-header'
import ChatBody from './chat-body/chat-body'

function Chat() {
    return (
        <ChatProvider>
            <ChatHeader />
            <ChatBody />
            <ChatFooter />
        </ChatProvider>
    )
}

export default Chat
