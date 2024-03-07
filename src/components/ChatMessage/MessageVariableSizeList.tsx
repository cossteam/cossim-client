import { useMessageStore } from '@/stores/message'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { VariableSizeList } from 'react-window'
import { scroll } from '@/shared'

export interface RowProps {
	index: number
	style: React.CSSProperties
	setItemSize: (index: number, size: number) => void
}

interface MessageVariableSizeListProps {
	Row: ({ index, style, setItemSize }: RowProps) => JSX.Element
	height: number
	el: RefObject<HTMLDivElement | null>
	isScrollEnd: (setp?: number) => boolean
}

const MessageVariableSizeList: React.FC<MessageVariableSizeListProps> = ({ Row, height, el, isScrollEnd }) => {
	const listRef = useRef<VariableSizeList | null>(null)
	// 根据索引记录列表的高度, 默认为50
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 50 })

	const { messages } = useMessageStore()
	const [isFristIn, setIsFristIn] = useState<boolean>(true)

	// 根据索引获取Item的尺寸
	const getItemSize = useCallback((index: number) => sizes[index] || 50, [sizes])

	const scrollEnd = (smoothScroll: boolean = false, scrollSpeed?: number) => {
		requestAnimationFrame(() => {
			setTimeout(() => {
				listRef.current?.scrollToItem(messages.length * messages.length, 'end')
				scroll(el.current!, smoothScroll, scrollSpeed)
			}, 100)
		})
	}

	useEffect(() => {
		if (!messages.length) return
		if (isFristIn) {
			scrollEnd()
			setIsFristIn(false)
		}

		!isFristIn && isScrollEnd(300) && scrollEnd(true, 300)
	}, [messages])

	// 根据索引，设置Item高度
	const setItemSize = useCallback((index = 1, size = 10) => {
		setSizes((prevSize) => {
			return {
				...prevSize,
				[index]: size
			}
		})
		// 根据索引，重置缓存位置。
		listRef.current?.resetAfterIndex(index, false)
	}, [])

	const rowRender = useCallback(({ index: rowIndex, style }: { index: number; style: React.CSSProperties }) => {
		return (
			<div data-index={rowIndex} style={style} className="variable-list">
				{Row({ index: rowIndex, style, setItemSize })}
			</div>
		)
	}, [])

	return (
		<VariableSizeList
			ref={listRef}
			height={height}
			itemCount={messages.length}
			itemSize={getItemSize}
			width="100%"
			initialScrollOffset={messages.length * messages.length}
		>
			{rowRender}
		</VariableSizeList>
	)
}

export default MessageVariableSizeList
