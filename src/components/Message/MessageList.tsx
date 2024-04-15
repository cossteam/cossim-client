import useMessageStore from '@/stores/message'
import MessageRow from './MessageRow'
import { useCallback, useEffect, useRef, useState } from 'react'
import { emojiOrMore } from '@/shared'
import { List } from 'framework7-react'
import { useIntersectionObserver } from '@reactuses/core'

const MessageList = () => {
	const messageStore = useMessageStore()

	useEffect(() => {
		if (messageStore.toolbarType === emojiOrMore.NONE) return
		if (messageStore.isAtBottom) bottomRef.current?.scrollIntoView({ block: 'end' })
	}, [messageStore.toolbarType])

	const [isFirstIn, setIsFirstIn] = useState<boolean>(true)

	const placeholderRef = useRef<HTMLDivElement | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	// const isEOF = useMemo(
	// 	() => messageStore.messages.length >= messageStore.allMessages.length,
	// 	[messageStore.messages, messageStore.allMessages]
	// )

	// useEffect(() => {
	// 	if (!placeholderRef.current) return
	// 	const ob: IntersectionObserver = new IntersectionObserver((entries) => {
	// 		if (entries[0].isIntersecting) {
	// 			// 如果没有更多消息了
	// 			if (isEOF) return ob.disconnect()

	// 			// 加载消息
	// 			if (!isLoading.current) loadingMessage()

	// 			// 设置加载状态
	// 			isLoading.current = true
	// 		}
	// 	})
	// 	ob.observe(placeholderRef.current)

	// 	return () => ob.disconnect()
	// }, [])

	// const loadingMessage = useCallback(async () => {
	// 	await messageStore.unshiftMessage()
	// 	isLoading.current = false
	// 	// 滚动到距离顶部的 100px
	// 	// setTimeout(() => messageStore.container?.scrollTo({ top: 300 }), 0)
	// }, [])

	const row = useCallback((item: Message, index: number) => <MessageRow item={item} key={index} />, [])

	useIntersectionObserver(bottomRef, (entry) => messageStore.update({ isAtBottom: entry[0].isIntersecting }))

	// 自动滚动到底部
	useEffect(() => {
		if (!bottomRef.current) return
		if (!messageStore.isAtBottom && !isFirstIn) return
		if (messageStore.isLoading) return
		bottomRef.current.scrollIntoView({ block: 'end' })
		if (isFirstIn) setIsFirstIn(false)
	}, [messageStore.messages])

	// 手动滚动到底部
	useEffect(() => {
		if (!bottomRef.current) return
		if (!messageStore.isScrollBottom) return
		try {
			if (!messageStore.isAtBottom) bottomRef.current.scrollIntoView({ block: 'end' })
		} finally {
			messageStore.update({ isScrollBottom: false })
		}
	}, [messageStore.isScrollBottom])

	// useEffect(() => {
	// 	if (!messageStore.isLoading) return
	// 	setTimeout(() => {
	// 		messageStore.unshiftMessage()
	// 		messageStore.update({ isLoading: false })
	// 	}, 1000)
	// }, [messageStore.isLoading])
	return (
		<div className="w-full h-auto relative">
			{messageStore.isLoading && (
				<div className="w-full h-10 top -z-1 text-center text-gray-500" ref={placeholderRef}>
					loading...
				</div>
			)}
			{messageStore.isGroupAnnouncement && <div className="h-10" />}
			<List className="m-0">{messageStore.messages.map((item, index) => row(item, index))}</List>
			<div className="w-full h-4 bottom-0" ref={bottomRef} />
		</div>
	)
}

export default MessageList
