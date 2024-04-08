import useMessageStore from '@/stores/message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'
// import { useInfiniteScroll } from '@reactuses/core'
// import InfiniteScroll from 'react-infinite-scroll-component'
// import MessageRow from './MessageRow'
// import { List } from 'framework7-react'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
	}, [container.current])

	// useInfiniteScroll(
	// 	container,
	// 	() => {
	// 		if (messageStore.isLoading) return
	// 		messageStore.update({ isLoading: true })
	// 		// messageStore.unshiftMessage()
	// 	},
	// 	{ distance: 50, direction: 'top' }
	// )

	// const row = useCallback((item: Message, index: number) => <MessageRow item={item} key={index} />, [])

	// const infiniteScrollRef = useRef(null)

	// const fetchMoreData = () => {
	// 	setTimeout(() => {
	// 		messageStore.unshiftMessage()
	// 	}, 500)
	// }

	return (
		<div className="flex-1 overflow-y-auto pt-4" ref={container}>
			<MessageList />
		</div>
		// <div id="scrollableDiv" className="flex flex-col-reverse flex-1 overflow-auto pt-4">
		// 	<InfiniteScroll
		// 		dataLength={messageStore.messages.length}
		// 		next={fetchMoreData}
		// 		style={{ display: 'flex', flexDirection: 'column-reverse' }}
		// 		inverse={true}
		// 		hasMore={true}
		// 		loader={messageStore.messages.length < messageStore.allMessages.length ? <h4>Loading...</h4> : null}
		// 		scrollableTarget="scrollableDiv"
		// 		ref={infiniteScrollRef}
		// 		scrollThreshold={0}
		// 	>
		// 		<List className="m-0">{messageStore.messages.map((item, index) => row(item, index))}</List>
		// 	</InfiniteScroll>
		// </div>
	)
}

export default MessageContent
