import useMessageStore from '@/stores/message'
import MessageRow from './MessageRow'
import { Key, useEffect, useRef, useState } from 'react'
import { emojiOrMore } from '@/shared'
import { List } from 'framework7-react'
import { useIntersectionObserver } from '@reactuses/core'

const MessageList = () => {
	const messageStore = useMessageStore()

	const [isFirstIn, setIsFirstIn] = useState<boolean>(true)
	const bottomRef = useRef<HTMLDivElement | null>(null)

	useIntersectionObserver(bottomRef, (entry) => messageStore.update({ isAtBottom: entry[0].isIntersecting }))

	useEffect(() => {
		if (messageStore.toolbarType === emojiOrMore.NONE) return
		if (messageStore.isAtBottom) bottomRef.current?.scrollIntoView({ block: 'end' })
	}, [messageStore.toolbarType])

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

	// const messageListRef = useRef<HTMLDivElement | null>(null)
	// useEffect(() => {
	// 	if (!messageListRef.current) return
	// 	console.log('containerHeight', messageListRef.current.clientHeight)
	// }, [])
	// ref={messageListRef}

	return (
		<div className="w-full h-auto relative">
			{messageStore.isGroupAnnouncement && <div className="h-10" />}
			<List className="m-0">
				{messageStore.messages.map((item: Message, index: Key | null | undefined) => (
					<MessageRow item={item} key={index} />
				))}
			</List>
			<div className="w-full h-4 bottom-0" ref={bottomRef} />
		</div>
	)
}

export default MessageList
