import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { generateMessageList } from '@/mock/data'
// import { useVirtualizer } from '@tanstack/react-virtual'
import MessageItem from './message-item'
import VirtualizerList, { VirtualizerListHandle } from '@/components/virtualizer-list'
// import useDefer from '@/hooks/useDefer'
// import clsx from 'clsx'

const MessageContent = memo(() => {
	const parentRef = useRef<HTMLDivElement>(null)
	const [, height] = useElementSize(parentRef)

	const virtualizerRef = useRef<VirtualizerListHandle>(null)

	const [data, setData] = useState<Message[]>([])
	const [, setLoading] = useState<boolean>(false)
	// const [isScrolled, setIsScrolled] = useState<boolean>(false)
	// const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false)
	// const [firstRender, setFirstRender] = useState<boolean>(true)

	const count = useMemo(() => data.length, [data])
	// const { defer, isRendering, isRenderFinish } = useDefer(count)
	// const virtualizer = useVirtualizer({
	// 	count,
	// 	getScrollElement: () => parentRef.current,
	// 	estimateSize: () => 45,
	// 	overscan: 5
	// })

	// 异步加载数据，防止阻塞渲染
	const loadData = async () => {
		setLoading(true)
		const newData = await new Promise<Message[]>((resolve) => {
			resolve(generateMessageList(20))
		})
		setData(newData)
		// setIsScrolled(true)
	}

	useEffect(() => {
		loadData()
	}, [])

	// 首次渲染完成后滚动到底部
	// useEffect(() => {
	// 	if (isRenderFinish && virtualizerRef.current) {
	// 		virtualizerRef.current?.virtualizer?.scrollToIndex(count - 1)
	// 	}
	// }, [isRenderFinish, virtualizerRef.current?.virtualizer])

	// const isTop = useCallback(
	// 	(index: number) => {
	// 		if (count === 0) return false
	// 		if (count <= 10) return index < 10
	// 		return index <= 0
	// 	},
	// 	[count]
	// )
	// useLayoutEffect(() => {
	// 	if (firstRender) {
	// 		setFirstRender(false)
	// 		return
	// 	}

	// 	const [lastItem] = [...virtualizer.getVirtualItems()]
	// 	if (!lastItem) return

	// 	if (isTop(lastItem.index) && !isFetchingNextPage) {
	// 		fetchingNextPage()
	// 	}
	// }, [virtualizer.getVirtualItems()])

	// const fetchingNextPage = useCallback(async () => {
	// 	setIsFetchingNextPage(true)
	// 	console.log('加载数据')
	// 	// 每次要加载的条数
	// 	const len = 100
	// 	const newData = await new Promise<Message[]>((resolve) => {
	// 		setTimeout(() => {
	// 			resolve(generateMessageList(len))
	// 		}, 0)
	// 	})
	// 	setData((prevData) => [...newData, ...prevData])

	// 	// virtualizer.scrollToIndex(len)
	// 	// setIsFetchingNextPage(false)
	// }, [])

	const renderItem = useCallback(
		(index: number) => {
			return (
				<div>
					{index} <MessageItem message={data[index]} />
				</div>
			)
		},
		[data]
	)

	return (
		<Flex
			className="flex-1 overflow-y-auto overflow-x-hidden flex-col-reverse relative"
			style={{ height, contain: 'strict' }}
			ref={parentRef}
			vertical
		>
			{/* <Flex
				className={clsx(
					'flex-1 h-full bg-background absolute top-0 left-0 w-full z-10',
					isRendering ? '!flex' : '!hidden'
				)}
				align="center"
				justify="center"
			>
				loading...
			</Flex> */}
			<VirtualizerList
				count={count}
				listHeight={height}
				renderItem={renderItem}
				ref={virtualizerRef}
				loading
				isScrollToEnd
			/>
			{/* <Flex
				style={{
					height: virtualizer.getTotalSize(),
					width: '100%',
					position: 'relative'
				}}
			>
				{virtualizer.getVirtualItems().map((virtualRow) => (
					<Flex
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							transform: `translateY(${virtualRow.start}px)`
						}}
						key={virtualRow.key}
						data-index={virtualRow.index}
						ref={virtualizer.measureElement}
					>
						<MessageItem message={data[virtualRow.index]} />
					</Flex>
				))}
			</Flex> */}
		</Flex>
	)
})

export default MessageContent
