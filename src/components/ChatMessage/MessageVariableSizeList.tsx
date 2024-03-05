import { useMessageStore } from '@/stores/message'
import { useCallback, useEffect, useRef, useState } from 'react'
import { VariableSizeList } from 'react-window'

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
	// 根据索引记录列表的高度, 默认为50
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 50 })

	const { messages } = useMessageStore()

	// 根据索引获取Item的尺寸
	const getItemSize = useCallback(
		(index: number) => {
			return sizes[index] || 50
		},
		[sizes]
	)

	useEffect(() => {
		if (!messages.length) return
		requestAnimationFrame(() => {
			setTimeout(() => {
				listRef.current?.scrollToItem(messages.length * messages.length, 'end')
			}, 0)
		})
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
		<VariableSizeList ref={listRef} height={height} itemCount={messages.length} itemSize={getItemSize} width="100%">
			{rowRender}
		</VariableSizeList>
	)
}

export default MessageVariableSizeList
