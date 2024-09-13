import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
import Chat from '@/components/chat/chat'
import ChatList from '@/components/chat/chat-list'

const ChatPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
                <ChatList />
            </FlexboardSidebar>
            <FlexboardContent>
                <Chat />
            </FlexboardContent>
        </Flexboard>
    )
}

export default ChatPage
