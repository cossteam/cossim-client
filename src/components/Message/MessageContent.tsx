import { MESSAGE_CONTENT_ID } from '@/shared'
import { useChatStore } from '@/stores/chat'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Element, animateScroll } from 'react-scroll'

const defaultAnimationOptions = {
	duration: 0,
	smooth: false,
	containerId: MESSAGE_CONTENT_ID
}

const MessageContent = () => {
	const contentRef = useRef<HTMLDivElement | null>(null)
	const chatStore = useChatStore()

	// 首次渲染
	const [render, setRender] = useState<boolean>(true)
	// 显示滚动到底部的按钮
	// const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false)

	//  判断是否滚动到底部
	const isScrollToBottom = useCallback((end: number = 100) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - end
	}, [])

	useEffect(() => {
		if (!chatStore.beforeOpened) return
		// 首次进来需要滚动到底部
		animateScroll.scrollToBottom(defaultAnimationOptions)
		chatStore.updateOpened(true)

		render && setRender(false)
	}, [chatStore.beforeOpened])

	// 接收到消息时，判断是否需要滚动到最底部，如果需要就滚动到最底部
	useEffect(() => {
		console.log('消息更新')
		if (!chatStore.messages || render) return
		if (isScrollToBottom()) {
			// setShowScrollToBottom(false)
			animateScroll.scrollToBottom({ ...defaultAnimationOptions, duration: 300, smooth: true })
		} else {
			// setShowScrollToBottom(true)
		}
	}, [chatStore.messages])

	return (
		<div className={clsx('flex-1 overflow-y-auto overflow-x-hidden')} ref={contentRef} id={MESSAGE_CONTENT_ID}>
			{chatStore.messages.map((item, index) => (
				<Element key={index} name={`section_${index}`} className="w-full" id={`section_${index}`}>
					<section className="mb-3">{item.content}</section>
				</Element>
			))}

			{/* {showScrollToBottom && <div className="fixed bottom-[80px] right-10 w-10 h-10 bh-white z-[99]">111</div>} */}
		</div>
	)
}

export default MessageContent
