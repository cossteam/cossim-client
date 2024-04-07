import useMessageStore from '@/stores/message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'
// import { useInfiniteScroll } from '@reactuses/core'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
	}, [container.current])

	// useInfiniteScroll(
	// 	container,
	// 	async () => {
	// 		console.log('滚动到顶部啦')
	// 		await messageStore.unshiftMessage()
	// 	},
	// 	{ distance: 0, direction: 'top' }
	// )

	return (
		<div
			className="flex-1 overflow-y-auto pt-4"
			ref={container}
			// onTouchStart={() => messageStore.container?.focus()}
		>
			<MessageList />
		</div>
	)
}

export default MessageContent
