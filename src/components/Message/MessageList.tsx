import useMessageStore from '@/stores/new_message'
import MessageRow from './MessageRow'
import { useCallback, useEffect } from 'react'
import { emojiOrMore } from '@/shared'
import { List } from 'framework7-react'

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

	const row = useCallback((item: any, index: number) => <MessageRow item={item} key={index} />, [])

	return <List className="m-0">{messageStore.messages.map((item, index) => row(item, index))}</List>
}

export default MessageList
