import React from 'react'
import PropType from 'prop-types'
// import { Messages, Message } from 'framework7-react'
import { clsx } from 'clsx'
import { useEffect, useState, useRef } from 'react'

const isSend = (type) => type === 'sent'

export default function MessageBox(props) {
	const { messages } = props

	const msgRef = useRef(null)
	// let startTime = 0
	// let endTime = 0

	// const [time, setTime] = useState(new Date())

	useEffect(() => {
		console.log('message', messages)
		if (msgRef.current) {
			// 滚动到最低部
            console.log("msgRef.current",msgRef.current);
            msgRef.current.scrollTo(0, document.body.scrollHeight)
		}
	}, [messages])

    console.log("");

	const handlerTouched = () => {
		// endTime = +new Date()
		// clearTimeout(timer)
		// setTime
		// if (endTime - startTime < 700) {
		// 	// 处理点击事件
		// }
	}

    useEffect(()=> {
        console.log("高度改变");
    },[visualViewport.height])

	return (
		<div className="py-4 overflow-auto" ref={msgRef} style={{ height: visualViewport.height - 88 + 'px' }}>
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
							<div
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
							</div>
							<div className={clsx('px-[6px]', isSend(message.type) ? 'order-first' : 'order-last')}>
								{/* <div className={clsx('text-[12px]',isSend(message.type) ? 'text-right' : 'order-last')}>群聊</div> */}
								<div
									className={clsx(
										'rounded-md px-3 py-[6px] text-[1rem]',
										isSend(message.type) ? 'bg-primary text-white' : 'bg-white'
									)}
									onTouchEnd={handlerTouched}
								>
									{message.content}
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
	avatar: PropType.node
}
