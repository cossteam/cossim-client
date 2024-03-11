import { MESSAGE_CONTENT_ID } from '@/shared'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import MessageVirtualList from './components/MessageVirtualList'
import MessageRow from './components/MessageRow'
import { useChatStore } from '@/stores/chat'

const MessageContent = () => {
	const contentRef = useRef<HTMLDivElement | null>(null)
	const chatStore = useChatStore()
	// 页面高度
	const [height, setHeight] = useState<number>(700)

	// 首次进来需要滚动到底部, 需等待消息加载完毕后再进入页面
	useEffect(() => {
		if (!chatStore.beforeOpened) return
		chatStore.updateOpened(true)
	}, [chatStore.beforeOpened])

	useEffect(() => {
		setHeight(contentRef.current!.offsetHeight ?? 700 - 10)
	}, [])

	return (
		<div className={clsx('flex-1 overflow-y-auto overflow-x-hidden')} ref={contentRef} id={MESSAGE_CONTENT_ID}>
			<MessageVirtualList
				Row={({ index, style, setItemSize }) => (
					<MessageRow
						index={index}
						style={style}
						setItemSize={setItemSize}
						selectChange={() => {}}
						onSelect={() => {}}
					/>
				)}
				height={height}
			/>
		</div>
	)
}

export default MessageContent
