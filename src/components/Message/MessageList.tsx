import useMessageStore from '@/stores/new_message'
import MessageRow from './MessageRow'
import { useCallback, useEffect } from 'react'
import { emojiOrMore } from '@/shared'

const MessageList = () => {
	const messageStore = useMessageStore()

	// 滚动到底部
	useEffect(() => {
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.container, messageStore.messages])

	useEffect(() => {
		if (messageStore.toolbarType === emojiOrMore.NONE) return
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.toolbarType])

	const row = useCallback((item: any, index: number) => <MessageRow key={index} item={item} />, [])

	return messageStore.messages.map((item, index) => row(item, index))
}

export default MessageList
