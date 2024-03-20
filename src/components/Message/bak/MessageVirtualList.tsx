import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ListOnItemsRenderedProps, VariableSizeList } from 'react-window'
import { isMe } from '@/shared'
import { useChatStore } from '@/stores/chat'

export interface RowProps {
	index: number
	style: React.CSSProperties
	setItemSize: (index: number, size: number) => void
}

interface MessageVariableSizeListProps {
	Row: ({ index, style, setItemSize }: RowProps) => JSX.Element
	height: number
}

const MessageVirtualList: React.FC<MessageVariableSizeListProps> = ({ Row, height }) => {
	// 虚拟列表实例
	const listRef = useRef<VariableSizeList | null>(null)
	// 根据索引记录列表的高度, 默认为50
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 80 })
	// 首次渲染
	const [render, setRender] = useState<boolean>(true)
	// 会话仓库
	const chatStore = useChatStore()
	// 消息总数
	const messageCount = useMemo(() => chatStore.messages.length, [chatStore.messages])
	// 根据索引获取Item的尺寸
	const getItemSize = useCallback((index: number) => sizes[index] || 80, [sizes])

	useEffect(() => {
		if (!chatStore.beforeOpened) return
		// if (!render) return
		requestAnimationFrame(() => {
			setTimeout(() => {
				listRef.current?.scrollToItem(messageCount, 'end')
				chatStore.updateOpened(true)
			}, 100)
		})
		setRender(false)
	}, [chatStore.beforeOpened])

	useEffect(() => {
		if (!chatStore.messages || render) return
		const last = chatStore.messages.at(-1)
		// 如果当前已经在最底部了，或者是自己发送的消息，就立马滚动到底部
		if (chatStore.isAtBottom || isMe(last?.sender_id ?? '')) {
			listRef.current?.scrollToItem(messageCount, 'end')
		}
	}, [chatStore.messages])

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

	const onItemsRendered = useCallback(({ overscanStopIndex, visibleStopIndex }: ListOnItemsRenderedProps) => {
		chatStore.updateIsAtBottom(overscanStopIndex === visibleStopIndex)
	}, [])

	useEffect(() => {
		!chatStore.opened && setRender(true)
	}, [chatStore.opened])

	return (
		<VariableSizeList
			ref={listRef}
			height={height}
			itemCount={messageCount}
			itemSize={getItemSize}
			width="100%"
			onItemsRendered={onItemsRendered}
			initialScrollOffset={messageCount}
		>
			{rowRender}
		</VariableSizeList>
	)
}

export default MessageVirtualList
