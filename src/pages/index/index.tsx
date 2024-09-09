import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'

const ChatPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
            </FlexboardSidebar>
            <FlexboardContent>2</FlexboardContent>
        </Flexboard>
    )
}

export default ChatPage
