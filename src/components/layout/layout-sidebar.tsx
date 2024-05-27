import { memo } from 'react'
import clsx from 'clsx'
import ChatList from '@/components/chat-list'
import { generateChatList } from '@/mock/data'
import LayoutHeader from './layout-header'

const LayoutSidebar = memo(() => {
	return (
		<div
			className={clsx(
				'min-w-[180px] w-full border-r h-screen overflow-auto',
				__IS_ELECTRON__ && ' w750:w-[250px] w750:max-w-[300px] ',
				!__IS_ELECTRON__ && __IS_WEB__ && 'w750:w-[400px] w750:max-w-[500px] '
			)}
		>
			<LayoutHeader />
			<ChatList data={generateChatList(30)} />
		</div>
	)
})

export default LayoutSidebar
