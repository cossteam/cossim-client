import { Flexboard, FlexboardSidebar, FlexboardContent } from '@/components//common/flex-board'
import SidebarSearch from '@/components/common/sidebar-search'
// import Chat from '@/components/chat/index'
// import DialogList from '@/components/dialog/dialog-list'
import { lazy } from 'react'

const DialogList = lazy(() => import('@/components/dialog/dialog-list'))
const Chat = lazy(() => import('@/components/chat/index'))

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
