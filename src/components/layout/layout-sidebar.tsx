import { memo } from 'react'
import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import { generateChatList } from '@/mock/data'
import LayoutHeader from './layout-header'
import { Flex } from 'antd'

const LayoutSidebar = memo(() => {
	return (
		<Flex
			className={clsx(
				'min-w-[180px] w-full border-r h-screen overflow-auto',
				__IS_ELECTRON__ && ' mobile:w-[250px] mobile:max-w-[300px] ',
				!__IS_ELECTRON__ && __IS_WEB__ && 'mobile:w-[400px] mobile:max-w-[500px] '
			)}
			vertical
		>
			<LayoutHeader />
			<ChatList data={generateChatList(30)} />
		</Flex>
	)
})

export default LayoutSidebar
