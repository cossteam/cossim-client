import useMessageStore from '@/stores/message'
import MessageRow from './MessageRow'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { emojiOrMore } from '@/shared'
import { List } from 'framework7-react'

const MessageList = () => {
	const messageStore = useMessageStore()

	// 滚动到底部
	useEffect(() => {
		if (isLoading.current) return
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.container, messageStore.messages])

	useEffect(() => {
		if (messageStore.toolbarType === emojiOrMore.NONE) return
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.toolbarType])

	const placeholderRef = useRef<HTMLDivElement | null>(null)
	const isLoading = useRef<boolean>(false)

	const isEOF = useMemo(
		() => messageStore.messages.length >= messageStore.allMessages.length,
		[messageStore.messages, messageStore.allMessages]
	)

	useEffect(() => {
		if (!placeholderRef.current) return
		const ob: IntersectionObserver = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				// 如果没有更多消息了
				if (isEOF) return ob.disconnect()

				// 加载消息
				if (!isLoading.current) loadingMessage()

				// 设置加载状态
				isLoading.current = true
			}
		})
		ob.observe(placeholderRef.current)

		return () => ob.disconnect()
	}, [])

	const loadingMessage = useCallback(async () => {
		await messageStore.unshiftMessage()
		isLoading.current = false
		// 滚动到距离顶部的 100px
		// setTimeout(() => messageStore.container?.scrollTo({ top: 300 }), 0)
	}, [])

	const row = useCallback((item: Message, index: number) => <MessageRow item={item} key={index} />, [])

	return (
		<div className="w-full h-auto relative">
			<div className="w-full h-10 absolute top -z-1" ref={placeholderRef} />
			{messageStore.isGroupAnnouncement && <div className="h-10" />}
			<List className="m-0">{messageStore.messages.map((item, index) => row(item, index))}</List>
		</div>
	)
}

export default MessageList
