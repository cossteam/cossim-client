import React from 'react'
import PropType from 'prop-types'
// import { Messages, Message } from 'framework7-react'
import { clsx } from 'clsx'
import { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'

const isSend = (type) => type === 'sent'

const Select = () => {
	return (
		<div className="absolute bottom-[120%] w-[150px] left-1/2 -translate-x-1/2 p-2 rounded bg-black text-white after:w-0 after:h-0 after:border-[5px] after:border-transparent after:border-t-black after:absolute after:top-full after:block after:left-1/2 after:-translate-x-1/2">
			111
		</div>
	)
}

let root = null

export default function MessageBox(props) {
	const { messages, height } = props

	const msgRef = useRef(null)

	const [timeOutEvent, setTimeOutEvent] = useState(0)

	// const [root, setRoot] = useState(null)
	let root = null

	useEffect(() => {
		console.log('message', messages)
		if (msgRef.current) {
			// 滚动到最低部
			console.log('msgRef.current', msgRef.current)
			msgRef.current.scrollTo(0, document.body.scrollHeight)
		}
	}, [messages])

	useEffect(() => {
		const removeRoot = () => {
			console.log('root', root)
			root?.unmount()
		}

		document.body.addEventListener('click', removeRoot)

		return () => {
			document.body.removeEventListener('click', removeRoot)
		}
	}, [])

	const handlerTouch = (e) => {
        root = null
		const id = e.target?.querySelector('.select')?.id
		if (!id) return
		root = createRoot(document.getElementById(id))
		root.render(<Select />)
		console.log('root', root)
	}

	useEffect(() => {
		console.log('高度改变')
	}, [visualViewport.height])

	return (
		<div className="py-4 overflow-auto" ref={msgRef} style={{ height }}>
			{messages.map((message, index) => (
				<div key={index}>
					{/* <div className="text-center my-2 text-gray-500 max-w-[75%] text-[12px] mx-auto">昨天 下午4:54</div> */}
					<div
						className={clsx(
							'flex mb-4 animate__animated animate__slideInUp animate__faster',
							isSend(message.type) && 'justify-end'
						)}
					>
						<div className="px-2 max-w-[75%] w-[fit-content] flex items-start break-all">
							{/* <div
								className={clsx(
									'w-10 h-10 rounded-full min-w-[40px]',
									isSend(message.type) ? 'order-last' : 'order-first'
								)}
							>
								{props.avatar ? (
									props.avatar
								) : (
									<img
										src="https://picsum.photos/200/200"
										alt=""
										className="w-full h-full rounded-full object-cover"
									/>
								)}
							</div> */}
							<div className={clsx('px-[6px]', isSend(message.type) ? 'order-first' : 'order-last')}>
								{/* <div className={clsx('text-[12px]',isSend(message.type) ? 'text-right' : 'order-last')}>群聊</div> */}
								<div
									className={clsx(
										'rounded-md px-3 py-[6px] text-[1rem] relative',
										isSend(message.type) ? 'bg-primary text-white' : 'bg-white'
									)}
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
									{message.content_type === 3 ? '暂时不支持图片显示' : message.content}
									<div className="select" id={'data-' + Math.random().toString(36).slice(-6)}></div>
								</div>
							</div>
						</div>
					</div>
					{/* <div className="text-center my-2 text-gray-500 max-w-[75%] text-sm mx-auto">对方不是你的好友</div>*/}
				</div>
			))}
		</div>
	)
}

MessageBox.propTypes = {
	messages: PropType.array.isRequired,
	avatar: PropType.node,
	height: PropType.string
}
