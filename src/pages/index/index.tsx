import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
import Chat from '@/components/dialog/chat'
import DialogList from '@/components/dialog/dialog-list'

const DialogPage = () => {
    return (
        <Flexboard>
            <FlexboardSidebar>
                <SidebarSearch />
                <DialogList />
            </FlexboardSidebar>
            <FlexboardContent>
                <Chat />
            </FlexboardContent>
        </Flexboard>
    )
}

export default DialogPage
