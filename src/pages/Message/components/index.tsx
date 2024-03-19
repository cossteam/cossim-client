import { Page } from 'framework7-react'
import '../message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()

	return (
		<Page noToolbar className="coss_message transition-all relative">
			<div className="h-screen overflow-hidden flex flex-col" style={{ height }}>
				<MessageHeader />
			</div>
		</Page>
	)
}

export default Message
