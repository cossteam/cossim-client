import { useMessageStore } from '@/stores/message'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ListOnScrollProps, VariableSizeList } from 'react-window'

export interface RowProps {
	index: number
	style: React.CSSProperties
	setItemSize: (index: number, size: number) => void
}

interface MessageVariableSizeListProps {
	Row: ({ index, style, setItemSize }: RowProps) => JSX.Element
	height: number
}

const MessageVariableSizeList: React.FC<MessageVariableSizeListProps> = ({ Row, height }) => {
	const listRef = useRef<VariableSizeList | null>(null)
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 80 })
	const prevScrollTop = useRef(0)

	const msgStore = useMessageStore()
	const [isFirstIn, setIsFirstIn] = useState<boolean>(true)

	const getItemSize = useCallback((index: number) => sizes[index] || 80, [sizes])

	useEffect(() => {
		if (!msgStore.messages.length) return
		if (isFirstIn && listRef.current && msgStore.messages.length > 10) {
			listRef.current.scrollToItem(msgStore.messages.length, 'end')
			setIsFirstIn(false)
		}

		// if (!isFirstIn && !msgStore.refresh) {
		// 	listRef.current?.scrollToItem(msgStore.messages.length, 'end')
		// }
	}, [msgStore.messages, isFirstIn])

	const setItemSize = useCallback((index = 1, size = 10) => {
		setSizes((prevSize) => ({
			...prevSize,
			[index]: size
		}))
		listRef.current?.resetAfterIndex(index, false)
	}, [])

	const rowRender = useCallback(({ index: rowIndex, style }: { index: number; style: React.CSSProperties }) => {
		return (
			<div data-index={rowIndex} style={style} className="variable-list">
				{Row({ index: rowIndex, style, setItemSize })}
			</div>
		)
	}, [])

	const handlerScroll = useCallback(
		(options: ListOnScrollProps) => {
			if (options.scrollOffset === 0) {
				prevScrollTop.current = msgStore.messages.length
				msgStore.addMessages()
			}
		},
		[msgStore.messages]
	)

	useEffect(() => {
		if (!msgStore.refresh) return
		// listRef.current?.scrollToItem(prevScrollTop.current, 'start')
		// msgStore.updateRefresh(false)
	}, [msgStore.messages, msgStore.refresh])

	const pageHeight = useRef<number>(0)
	const newPageHeight = useRef<number>(0)
	useEffect(() => {
		// 获取页面高度
		pageHeight.current = document.documentElement.clientHeight
		const handlerWindowSize = () => {
			newPageHeight.current = document.documentElement.clientHeight
			if (newPageHeight.current !== pageHeight.current) {
				listRef.current?.scrollToItem(msgStore.messages.length, 'end')
			}
		}

		window.addEventListener('resize', handlerWindowSize)

		return () => {
			window.removeEventListener('resize', handlerWindowSize)
		}
	}, [])

	return (
		<VariableSizeList
			ref={listRef}
			height={height}
			itemCount={msgStore.messages.length}
			itemSize={getItemSize}
			width="100%"
			initialScrollOffset={msgStore.messages.length}
			onScroll={handlerScroll}
		>
			{rowRender}
		</VariableSizeList>
	)
}

export default MessageVariableSizeList
