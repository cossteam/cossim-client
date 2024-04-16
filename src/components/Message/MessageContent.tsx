import useMessageStore from '@/stores/message'
import MessageList from './MessageList'
import { useEffect, useRef } from 'react'
// import { useInfiniteScroll } from '@reactuses/core'
import InfiniteScroll from 'react-infinite-scroll-component'
// import MessageRow from './MessageRow'
// import { List } from 'framework7-react'
// import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
// import MessageRow from './MessageRow'
import Loading from '../Loading/Loading'
import clsx from 'clsx'
// import MessageVariableSizeList, { RowProps } from './MessageVariableSizeList'
// import MessageItem from './MessageItem'
// import { useWindowSize } from '@reactuses/core'

const MessageContent = () => {
	const container = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	const infiniteScrollRef = useRef<any>(null)

	// const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (!container.current) return
		messageStore.update({ container: container.current })
		// setIndex(messageStore.messages.length)
	}, [container.current])

	// const virtuoso = useRef<VirtuosoHandle>(null)
	// const timer = useRef<any>()
	// const [index, setIndex] = useState<number>(0)

	// const loadMore = () => {
	// 	if (timer.current) clearTimeout(timer.current)
	// 	timer.current = setTimeout(() => {
	// 		// setList((list) => [...generateData(10), ...list])
	// 		messageStore.unshiftMessage()
	// 		setLoading(false)
	// console.log("load", list);
	// 调整滚动位置，向下滚动一段距离
	// if (virtuoso.current) {
	// 	virtuoso.current?.scrollToIndex({
	// 		index: 15,
	// 		align: 'start',
	// 		behavior: 'auto'
	// 	})
	// 	setIndex(messageStore.messages.length)
	// }
	// 	}, 500)
	// }

	const fetchMoreData = () => {
		// a fake async api call like which sends
		// 20 more records in 1.5 secs
		setTimeout(() => {
			messageStore.unshiftMessage()
		}, 1500)
	}

	// const { height } = useWindowSize()
	// const bottomRef = useRef<HTMLDivElement | null>(null)

	// const Row = useCallback((props: RowProps) => <MessageItem {...props} />, [messageStore.messages])

	return (
		// <div className="flex-1 overflow-y-auto pt-4" ref={container}>
		// 	<MessageList />
		// </div>

		// react-windows
		// <div className="flex-1 overflow-y-auto" ref={container}>
		// 	<MessageVariableSizeList Row={Row} height={height} />
		// 	<div className="w-full h-1" ref={bottomRef} />
		// </div>

		// 无限加载 flexDirection: 'column-reverse'
		<div
			id="scrollableDiv"
			className={clsx('flex flex-1 overflow-auto pt-4', messageStore.messages.length >= 15 && 'flex-col-reverse')}
		>
			<InfiniteScroll
				dataLength={messageStore.messages.length}
				next={fetchMoreData}
				style={{ display: 'flex', flexDirection: 'column-reverse', width: '100vw' }}
				inverse={true}
				hasMore={true}
				loader={messageStore.messages.length < messageStore.allMessages.length ? <Loading /> : null}
				scrollableTarget="scrollableDiv"
				ref={infiniteScrollRef}
				scrollThreshold={0}
			>
				<MessageList />
			</InfiniteScroll>
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
