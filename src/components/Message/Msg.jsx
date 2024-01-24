import React from 'react'
import PropType from 'prop-types'
import { Messages, Message, Icon, Popover, List, ListItem, Link } from 'framework7-react'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import { useEffect, useState, useRef } from 'react'
import { $t } from '@/i18n'
// import tippy from 'tippy.js'
// import 'tippy.js/dist/tippy.css'
import { createRoot } from 'react-dom/client'

const messageTime = (message) => {
	return message?.created_at
		? Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.created_at))
		: ''
}

const Select = () => {
	return (
		<div className="absolute bottom-[120%] h-[100px] left-1/2 -translate-x-1/2 p-10 bg-black text-white">111</div>
	)
}

export default function MessageBox(props) {
	const { messages } = props

	const [timeOutEvent, setTimeOutEvent] = useState(0)
	const [opened, setOpened] = useState('')
	const popoverRef = useRef(null)

	const isMessageFirst = (message) => {
		const messageIndex = messages.indexOf(message)
		const previousMessage = messages[messageIndex - 1]
		return !previousMessage || previousMessage.type !== message.type
	}
	const isMessageLast = (message) => {
		const messageIndex = messages.indexOf(message)
		const nextMessage = messages[messageIndex + 1]
		return !nextMessage || nextMessage.type !== message.type
	}

	useEffect(() => {
		console.log('message', messages)
	}, [messages])

	useEffect(() => {
		const removeRoot = () => setOpened(false)

		document.body.addEventListener('click', removeRoot)

		return () => {
			document.body.removeEventListener('click', removeRoot)
		}
	}, [])

	useEffect(() => {
		if (popoverRef.current && opened) {
			popoverRef.current.style.display = 'block'
		}

		if (popoverRef.current && !opened) {
			popoverRef.current.style.display = 'none'
		}
	}, [opened])

	const handlerTouch = (e) => {
		console.log('e', e.targetTouches)

		const clientX = e.targetTouches[0].clientX
		const clientY = e.targetTouches[0].clientY

		console.log('popoverRef', popoverRef.current)

		if (popoverRef.current) {
			// 确保元素在可视区域
			const rect = popoverRef.current.getBoundingClientRect()
			console.log('rect', rect)

			popoverRef.current.style.top = `${clientY}px`
			popoverRef.current.style.left = `${clientX}px`

			// 确保元素位置在可视区域，且不被遮挡，才显示
			// const rect = popoverRef.current.getBoundingClientRect()
			// console.log("rect", rect)

			// if (rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight || rect.right > window.innerWidth) {
			// 	return
			// }

			if (opened) setOpened(false)

			setOpened(true)
		}
	}

	return (
		<>
			{/* <Popover
				className="popover-select w-[160px]"
				arrow={false}
				backdrop={false}
				opened={opened}
				// targetEl="popover-select-btn"
				// containerEl="popover-select-btn"
			>
				<List className="text-white" dividersIos outlineIos strongIos>
					<ListItem link="/new_group/" popoverClose className="el-list">
						<span className="el-text">{$t('发起群聊')}</span>
					</ListItem>
					<ListItem link="/add_friend/" popoverClose className="el-list">
						<span className="el-text">{$t('添加朋友')}</span>
					</ListItem>
				</List>
			</Popover> */}
			{/* {opened && ( */}
			<div className="fixed z-[999] w-[300px] h-[150px] bg-black hidden" ref={popoverRef}>
				111
			</div>
			{/* )} */}
			<Messages>
				{messages.map((message, index) => (
					<Message
						key={index}
						className="popover-select-btn message-appear-from-bottom relative"
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						image={message.content_type === 3 ? [message.content] : ''}
						type={message.type}
					>
						<div
							slot="text"
							className="popover-select-btn"
							id={'data-' + Math.random().toString(36).slice(-6)}
							onTouchMove={() => {
								clearTimeout(timeOutEvent)
								setTimeOutEvent(0)
							}}
							onTouchStart={(e) => {
								setTimeOutEvent(setTimeout(() => handlerTouch(e), 800))
							}}
							onTouchEnd={() => {
								clearTimeout(timeOutEvent)
								setTimeOutEvent(0)
							}}
							onSelect={(e) => e.preventDefault()}
						>
							{message.content_type === 3 ? '' : message.content}
							{/* <div
								id={'data-' + Math.random().toString(36).slice(-6)}
								className="select w-auto h-auto fixed bottom-[120%]left-1/2 -translate-x-1/2 bg-black text-white"
							></div> */}
							{/* <Link
								popoverOpen=".popover-select-btn"
								id={'data-' + Math.random().toString(36).slice(-6)}
								className="opover-link"
							>
								343435454
							</Link> */}
						</div>

						<span slot="text-footer">
							{messageTime(message)}
							{message?.send_state && message.type === 'sent' ? (
								message.send_state === 'ok' ? (
									<DoubleTickIcon />
								) : (
									<Icon
										className="text-base"
										f7={message.send_state === 'sending' ? 'slowmo' : 'wifi_slash'}
										color="primary"
									/>
								)
							) : (
								''
							)}
						</span>
					</Message>
				))}
			</Messages>
		</>
	)
}

MessageBox.propTypes = {
	messages: PropType.array.isRequired,
	avatar: PropType.node,
	height: PropType.string
}
