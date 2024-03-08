import { useChatStore } from '@/stores/chat'
import { Navbar } from 'framework7-react'

const MessageHeader = () => {
	const chatStore = useChatStore()

	return (
		<div className="min-h-12 bg-bgPrimary">
			<Navbar
				title="1111"
				subtitle="[在线]"
				backLink
				outline={false}
				className="coss_message_navbar"
				onClickBack={() => {
					chatStore.updateBeforeOpened(false)
					chatStore.updateOpened(false)
				}}
			></Navbar>
		</div>
	)
}

export default MessageHeader
