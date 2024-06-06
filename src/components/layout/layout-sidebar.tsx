import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import LayoutHeader from './layout-header'
import { Flex } from 'antd'
import { memo } from 'react'
import LayoutFooter from './layout-footer'
import { ROUTE } from '@/utils/enum'
import ContactList from '@/components/contact-list'
import { useParams } from 'react-router-dom'

const LayoutSidebar = () => {
    const params = useParams()

    return (
        <Flex
            className={clsx(
                'min-w-[250px] w-full border-r h-screen overflow-auto',
                'mobile:w-[300px] mobile:max-w-[500px] '
            )}
            vertical
        >
            <LayoutHeader />
            {params.type === ROUTE.MESSAGE ? <ChatList /> : <ContactList />}
            <LayoutFooter />
        </Flex>
    )
}

export default memo(LayoutSidebar)
