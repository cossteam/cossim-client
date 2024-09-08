import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import LayoutHeader from './layout-header'
import { Flex } from 'antd'
import { memo, useMemo } from 'react'
import LayoutFooter from './layout-footer'
import { ROUTE } from '@/utils/enum'
import ContactList from '@/components/contact-list'
import { useParams } from 'react-router-dom'
import Profile from '@/components/profile'

const LayoutSidebar = () => {
    const { type } = useParams()

    const content = useMemo(() => {
        switch (type) {
            case ROUTE.MESSAGE:
                return <ChatList />
            case ROUTE.CONTACT:
                return <ContactList />
            case ROUTE.PROFILE:
                return <Profile />
            default:
                return null
        }
    }, [type])

    return (
        <Flex
            className={clsx(
                'min-w-[250px] w-full border-r h-screen overflow-auto',
                'mobile:w-[300px] mobile:max-w-[500px]'
            )}
            vertical
        >
            <LayoutHeader />
            {content}
            <LayoutFooter />
        </Flex>
    )
}

export default memo(LayoutSidebar)
