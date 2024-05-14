import useMessageStore from '@/stores/message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loading from '../Loading/Loading'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()
	const infiniteScrollRef = useRef<any>(null)

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
	}, [container.current])

	const fetchMoreData = () => {
		messageStore.update({ isLoading: true })
		messageStore.unshiftMessage()
	}

	// // const [height, setHeight] = useState(document.documentElement.clientHeight - 112)
	// const containerRef = useRef<HTMLDivElement | null>(null)

	// useEffect(() => {
	// 	if (containerRef.current) {
	// 		setHeight(containerRef.current?.clientHeight)
	// 	}
	// }, [containerRef.current])

	return (
		<div className="flex-1 overflow-auto">
			<div className="flex pt-4 flex-col-reverse h-full overflow-auto" id="scrollableDiv">
				{!messageStore.isLabel && (
					<InfiniteScroll
						dataLength={messageStore.messages.length}
						next={fetchMoreData}
						style={{ display: 'flex', flexDirection: 'column-reverse', width: '100vw' }}
						inverse={true}
						hasMore={true}
						loader={messageStore.isLoading ? <Loading /> : null}
						scrollableTarget="scrollableDiv"
						ref={infiniteScrollRef}
						scrollThreshold={0}
					>
						<MessageList />
					</InfiniteScroll>
				)}

				{messageStore.isLabel && !messageStore.allMessages.length && (
					<div className="w-full text-center pt-5 text-gray-400">暂无标注消息</div>
				)}
			</div>
		</div>

		// 虚拟列表
		// <div className="flex-1 overflow-y-auto" ref={container}>
		// 	{loading  && <div className="text-center">loading...</div>}
		// 	<Virtuoso
		// 		// 设置的高度
		// 		style={{ overflow: 'auto', padding: '10px 0' }}
		// 		// 数据
		// 		data={messageStore.messages}
		// 		increaseViewportBy={100}
		// 		// 初始化滚动到位置
		// 		initialTopMostItemIndex={messageStore.messages.length}
		// 		firstItemIndex={messageStore.messages.length}
		// 		// 默认图片高度
		// 		defaultItemHeight={300}
		// 		ref={virtuoso}
		// 		atTopStateChange={(isAtTop) => {
		// 			if (isAtTop) {
		// 				setLoading(true)
		// 				loadMore()
		// 			}
		// 		}}
		// 		followOutput={(isAtBottom: boolean) => {
		// 			if (isAtBottom) {
		// 				return 'smooth' // can be 'auto' or false to avoid scrolling
		// 			} else {
		// 				return false
		// 			}
		// 		}}
		// 		overscan={50}
		// 		itemContent={(_, item: any) => <MessageRow item={item} />}
		// 	/>
		// </div>
	)
}

export default MessageContent
