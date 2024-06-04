import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import LayoutHeader from './layout-header'
import { Flex } from 'antd'
import { memo } from 'react'
import useCacheStore from '@/stores/cache'

const LayoutSidebar = () => {
    const cacheStore = useCacheStore()

    return (
        <Flex
            className={clsx(
                'min-w-[250px] w-full border-r h-screen overflow-auto',
                'mobile:w-[300px] mobile:max-w-[500px] '
            )}
            vertical
        >
            <LayoutHeader />
            <ChatList data={cacheStore.cacheChatList} />
        </Flex>
    )
}

export default memo(LayoutSidebar)
