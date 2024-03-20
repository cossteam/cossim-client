import { Page } from 'framework7-react'
import './styles/Message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'
// import { keyboardChange } from '@/shared'
// import { useEffect } from 'react'
import useKeyboard from '@/hooks/useKeyboard'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()
	useKeyboard()

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
