import { Page } from 'framework7-react'
import '../message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()

	return (
		<Page noToolbar className="coss_message transition-all relative">
			<div className="h-screen overflow-hidden flex flex-col" style={{ height }}>
				<MessageHeader />
				<MessageContent />
				<MessageToolbar />
			</div>
		</Page>
	)
}

export default Message
