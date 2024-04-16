import useMessageStore from '@/stores/message'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ListOnScrollProps, VariableSizeList } from 'react-window'

export interface RowProps {
	index: number
	style: React.CSSProperties
	setItemSize: (index: number, size: number) => void
	item: any
}

interface MessageVariableSizeListProps {
	Row: (props: RowProps) => JSX.Element
	height: number
}

const MessageVariableSizeList: React.FC<MessageVariableSizeListProps> = ({ Row, height }) => {
	const listRef = useRef<VariableSizeList | null>(null)
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 80 })
	const prevScrollTop = useRef(0)

	const messageStore = useMessageStore()

	const getItemSize = useCallback((index: number) => sizes[index] || 80, [sizes])

	const setItemSize = useCallback((index = 1, size = 10) => {
		setSizes((prevSize) => ({
			...prevSize,
			[index]: size
		}))
		listRef.current?.resetAfterIndex(index, false)
	}, [])

	const rowRender = useCallback(
		({ index: rowIndex, style }: { index: number; style: React.CSSProperties }) => {
			return (
				<div data-index={rowIndex} style={style}>
					{Row({ index: rowIndex, style, setItemSize, item: messageStore.messages[rowIndex] })}
				</div>
			)
		},
		[messageStore.messages]
	)

	const handlerScroll = useCallback(
		(options: ListOnScrollProps) => {
			if (options.scrollOffset === 0) {
				prevScrollTop.current = messageStore.messages.length
				// msgStore.addMessages()
				console.log('触顶加载')
			}
		},
		[messageStore.messages]
	)

	useEffect(() => {
		if (!listRef.current) return
		listRef.current.scrollToItem(messageStore.messages.length - 1)
	}, [])

	return (
		<VariableSizeList
			ref={listRef}
			height={height}
			itemCount={messageStore.messages.length}
			itemSize={getItemSize}
			width="100%"
			// initialScrollOffset={messageStore.messages.length * messageStore.messages.length}
			onScroll={handlerScroll}
		>
			{rowRender}
		</VariableSizeList>
	)
}

export default MessageVariableSizeList
