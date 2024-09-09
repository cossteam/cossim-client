import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
import ChatList from '@/components/messages/chat-list'

const ChatPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
                <ChatList />
            </FlexboardSidebar>
            <FlexboardContent>2</FlexboardContent>
        </Flexboard>
    )
}

export default ChatPage
