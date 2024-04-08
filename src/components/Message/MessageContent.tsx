import useMessageStore from '@/stores/message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'
import { useInfiniteScroll } from '@reactuses/core'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
	}, [container.current])

	useInfiniteScroll(
		container,
		() => {
			messageStore.update({ isLoading: true })
		},
		{ distance: 50, direction: 'top' }
	)

	return (
		<div className="flex-1 overflow-y-auto pt-4" ref={container}>
			<MessageList />
		</div>
	)
}

export default MessageContent
