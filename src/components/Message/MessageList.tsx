import useMessageStore from '@/stores/new_message'
import MessageRow from './MessageRow'
import { useEffect } from 'react'
// import { useWindowSize } from '@reactuses/core'

const MessageList = () => {
	const messageStore = useMessageStore()
	// const { height } = useWindowSize()

	// 滚动到底部
	useEffect(() => {
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.container])

	return messageStore.messages.map((item, index) => <MessageRow key={index} item={item} />)
}

export default MessageList
