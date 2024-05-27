import { useWindowSize } from '@reactuses/core'
import { Flex } from 'antd'
import { memo } from 'react'
import MessageHeader from './message-header'
import MessageContent from './message-content'
import MessageFooter from './message-footer'
// import { useParams } from 'react-router'

const Messages = memo(() => {
	const { height } = useWindowSize()
	// const params = useParams()

	return (
		<Flex className="container--background flex-1 h-screen" style={{ height }} vertical align="stretch">
			<MessageHeader />
			<MessageContent />
			<MessageFooter />
		</Flex>
	)
})

export default Messages
