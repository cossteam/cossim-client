import { $t } from '@/shared'
import { Block, Icon, Link, NavLeft, NavTitle, Navbar, Page, Panel, Popup, View } from 'framework7-react'
import React, { useEffect, useRef, useState } from 'react'
import './css/MessagePopup.scss'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useWindowSize } from '@reactuses/core'
import { useChatStore } from '@/stores/chat'

interface MessagePopupProps {
	opened: boolean
}

const MessagePopup: React.FC<MessagePopupProps> = () => {
	const { width } = useWindowSize()
	const chatStore = useChatStore()

	const contentRef = useRef<HTMLDivElement | null>(null)

	// 等待数据加载完成时显示
	const [opacity, setOpacity] = useState<boolean>(false)

	const [data, setData] = useState([])

	useEffect(() => {
		setTimeout(() => {
			setData(Array.from({ length: 1000 }))
			setOpacity(true)
		}, 100)
	}, [])

	useEffect(() => {
		if (!data.length) return
		contentRef.current?.scrollTo(0, contentRef.current.scrollHeight)
	}, [data])

	return (
		<motion.div
			animate={{ opacity: chatStore.opened || opacity ? 1 : 0, x: chatStore.opened ? 0 : width }}
			transition={{ duration: 0.15, ease: 'easeIn' }}
			className={clsx('message-popup', { 'message-popup-opacity': opacity })}
		>
			<Page noToolbar className="coss_message transition-all relative">
				<div className="h-screen overflow-hidden flex flex-col">
					<div className="min-h-12 bg-bgPrimary">
						<Navbar
							title="1111"
							subtitle="[在线]"
							backLink
							outline={false}
							className="coss_message_navbar"
							onClickBack={() => chatStore.updateOpened(false)}
						></Navbar>
					</div>

					<div className={clsx('flex-1 overflow-y-auto overflow-x-hidden')} ref={contentRef}>
						{data.map((_, index) => (
							<div key={index} className="w-full h-10 bg-white my-2">
								{index + 1}
							</div>
						))}
					</div>
				</div>
			</Page>
		</motion.div>
	)
}

export default MessagePopup
