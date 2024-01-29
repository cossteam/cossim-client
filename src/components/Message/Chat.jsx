import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeftIcon, MoreIcon, CopyIcon } from '@/components/Icon/Icon'
import { clsx } from 'clsx'
// import MsgBar from './MsgBar'
// import { messages } from './data'
import { Marked } from '@ts-stack/markdown'
import hljs from 'highlight.js'
import './markdown.css'
import 'highlight.js/styles/github.min.css'
import { useClipboard, useClickOutside } from '@reactuses/core'
import LongPressButton from './LongPressButton'
import PropType from 'prop-types'
import { f7 } from 'framework7-react'
import { format } from 'timeago.js'
import DoubleTickIcon from '@/components/DoubleTickIcon'

Marked.setOptions({ highlight: (code, lang) => hljs.highlight(lang, code).value })

const PreHeader = (props) => {
	const [, copy] = useClipboard()
	const toastRef = useRef(null)

	toastRef.current = f7.toast.create({
		text: '复制成功',
		position: 'center',
		closeTimeout: 1000
	})

	const handlerCopy = () => {
		copy(props.text)
		toastRef.current.open()
	}

	return (
		<>
			<div className="flex justify-between h-7 absolute top-0  left-0 right-0 items-center px-2 border-b">
				<span className="text-gray-500 text-[0.75rem]">{props.lang}</span>
				<CopyIcon className="text-gray-500 w-4 h-4" onClick={handlerCopy} />
			</div>
		</>
	)
}

PreHeader.propTypes = {
	text: PropType.string,
	lang: PropType.string
}

const Tooltip = ({ el }) => {
	const tooltipRef = useRef(null)
	const [showToolTip, setShowToolTip] = useState(true)

	// 是否触发上下边界
	const [top, setTop] = useState(false)
	// 是否触发左边界
	const [left, setLeft] = useState(false)
	// 是否触发右边界
	const [right, setRight] = useState(false)

	useClickOutside(tooltipRef, () => setShowToolTip(false))

	useEffect(() => {
		// 边界控制
		if (el) {
			const tooltipEl = tooltipRef.current
			const elRect = el.getBoundingClientRect()
			const tooltipRect = tooltipEl.getBoundingClientRect()

			// 控制上边界
			elRect.top < tooltipEl.offsetHeight + 56 ? setTop(true) : setTop(false)

			console.log(elRect, tooltipRect)

			// 控制左边界
			tooltipRect.left <= 0 ? setLeft(true) : setLeft(false)

			// 控制右边界
			tooltipRect.left > 0 && elRect.width < 100 ? setRight(true) : setRight(false)
		}
	}, [el])

	return showToolTip ? (
		<div
			className={clsx(
				'absolute w-[200px] p-3 bg-black text-white rounded z-[99] bottom-full left-1/2 -translate-x-1/2',
				'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:border-transparent after:left-1/2 after:-translate-x-1/2',
				top
					? 'top-[calc(100%+10px)] bottom-auto after:border-b-black after:bottom-full'
					: 'bottom-[calc(100%+10px)] top-auto after:border-t-black after:top-full',
				left && '-translate-x-0 -left-[40px] after:left-[28%]',
				right && '-translate-x-0 -right-[40px] left-auto after:left-[72%]'
			)}
			ref={tooltipRef}
		>
			tooltips
		</div>
	) : null
}

Tooltip.propTypes = {
	el: PropType.any
}

const isSelf = (type) => type === 'sent'

function App({ messages, header, footer }) {
	const chatRef = useRef(null)
	const markdownRef = useRef(null)
	const msgRefs = useRef([])

	console.log('messages', messages)

	// 页面高度
	// const [pageHeight, setPageHeight] = useState(0)

	useEffect(() => {
		// setPageHeight(document.body.clientHeight)

		if (markdownRef.current) {
			const presEl = markdownRef.current.querySelectorAll('pre')

			presEl.forEach((pre) => {
				const code = pre.querySelector('code')
				const lang = code?.className.split('-')?.[1] || 'plain'
				const div = document.createElement('div')
				createRoot(div).render(<PreHeader lang={lang} text={code?.textContent} />)
				pre.appendChild(div)
			})
		}

		// 如果消息已经在底部，在键盘弹起后，自动滚动到底部
		const handelerSize = () => {
			const scrollTop = chatRef.current.scrollTop
			const scrollHeight = chatRef.current.scrollHeight
			const clientHeight = chatRef.current.clientHeight
			if (scrollTop >= scrollHeight - clientHeight - 300) {
				chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
			}
		}

		window.addEventListener('resize', handelerSize)
		return () => {
			window.removeEventListener('resize', handelerSize)
		}
	}, [])

	useEffect(() => {
		if (chatRef.current) chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
	}, [messages])

	const handlerLongPress = (index) => {
		const div = document.createElement('div')
		createRoot(div).render(<Tooltip el={msgRefs.current[index]} />)
		msgRefs.current[index].appendChild(div)
	}

	return (
		<div className="w-full h-screen overflow-hidden text-[1rem] bg-[#f8f8f8] relative" ref={chatRef}>
			{/* Header */}
			{header}

			{/* Content */}
			<div className="w-full py-4 px-2 overflow-y-auto h-[calc(100vh-112px)]">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={clsx(
							'w-full flex items-center mb-4',
							isSelf(msg.type) ? 'justify-end' : 'justify-start'
						)}
					>
						<div className="flex max-w-[80%] items-start">
							<img
								src={msg.avatar}
								alt=""
								className={clsx(
									'w-8 h-8 rounded-full',
									isSelf(msg.type) ? 'order-last ml-2' : 'order-first mr-2'
								)}
							/>
							<div className="flex-1">
								<LongPressButton callback={() => handlerLongPress(index)} className="w-full mb-1">
									<div
										data-index={index}
										className={clsx(
											'relative w-full flex',
											isSelf(msg.type) ? 'justify-end' : 'justify-start'
										)}
										ref={(el) => (msgRefs.current[index] = el)}
									>
										{msg.content_type === 1 && (
											<div
												className={clsx(
													'p-3 rounded relative',
													'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:top-[10px] after:border-transparent',
													isSelf(msg.type)
														? 'bg-primary text-white after:left-full after:border-l-primary'
														: 'bg-white after:right-full after:border-r-white'
												)}
											>
												{msg.content}
											</div>
										)}

										{msg.type === 'image' && (
											<img
												src={msg.content}
												alt=""
												className="max-w-[80%] object-cover rounded"
											/>
										)}

										{msg.type === 'markdown' && (
											<div
												className={clsx(
													'p-3 rounded relative markdown-body',
													'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:top-[10px] after:border-transparent',
													isSelf(msg.type)
														? 'bg-green-500 text-white after:left-full after:border-l-green-500'
														: 'bg-white after:right-full after:border-r-white'
												)}
												dangerouslySetInnerHTML={{
													__html: Marked.parse(msg.content)
												}}
												ref={markdownRef}
											/>
										)}
									</div>
								</LongPressButton>
								<div
									className={clsx(
										'text-[0.75rem] text-gray-400 flex',
										isSelf(msg.type) ? 'justify-end' : 'justify-start'
									)}
								>
									<span>{format(msg.send_time, 'zh_CN')}</span>
									{isSelf(msg.type) && <DoubleTickIcon />}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{footer}
		</div>
	)
}

App.propTypes = {
	messages: PropType.array.isRequired,
	header: PropType.node,
	footer: PropType.node
}

export default App
