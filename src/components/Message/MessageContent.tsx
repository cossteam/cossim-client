import useMessageStore from '@/stores/new_message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
	}, [container.current])

	return (
		<div
			className="flex-1 overflow-y-auto py-4"
			ref={container}
			// onTouchStart={() => messageStore.container?.focus()}
		>
			<MessageList />
		</div>
	)
}

export default MessageContent
