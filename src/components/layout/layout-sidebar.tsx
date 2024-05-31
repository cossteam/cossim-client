import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import { generateChatList } from '@/mock/data'
import LayoutHeader from './layout-header'
import { Flex } from 'antd'
import { memo } from 'react'

const LayoutSidebar = memo(() => {
  return (
    <Flex
      className={clsx(
        'min-w-[250px] w-full border-r h-screen overflow-auto',
        'mobile:w-[300px] mobile:max-w-[500px] '
      )}
      vertical
    >
      <LayoutHeader />
      <ChatList data={generateChatList(30)} />
    </Flex>
  )
})

export default LayoutSidebar
