import { Page } from 'framework7-react'
import './styles/Message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'
import useKeyboard from '@/hooks/useKeyboard'
import './styles/MessageTip.scss'
// import MessagePlaceholder from './MessageToolbar/MessagePlaceholder' 
import Contact from '@/components/Contact/Contact'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()
	useKeyboard()

	return (
		<Page noToolbar className="coss_message transition-all relative">
			<div className="h-screen overflow-hidden flex flex-col" style={{ height }}>
				<MessageHeader />
				<MessageContent />
				<MessageToolbar />
				{/* <MessagePlaceholder /> */}
			</div>

			{/* 转发弹出 */}
			<Contact
				completed={() => null}
				// opened={showSelectMember}
				// setOpened={updateShowSelectMember}
				// group
			/>
		</Page>
	)
}

export default Message
