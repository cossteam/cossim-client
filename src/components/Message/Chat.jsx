import React, { useEffect, useRef, useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { clsx } from 'clsx'
import 'highlight.js/styles/github.min.css'
import { useClipboard, useClickOutside } from '@reactuses/core'
import LongPressButton from './LongPressButton'
import PropType from 'prop-types'
import { format } from 'timeago.js'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import { ArrowUpRight, Exclamationmark, Gobackward } from 'framework7-icons/react'
import { sendType, sendState, tooltipsType } from '@/utils/constants'
import { Link, f7 } from 'framework7-react'
import Contact from '@/components/Contact/Contact'
import { $t } from '@/i18n'
import userService from '@/db'
import Editor from '@/components/Editor/Editor'
import MsgBar from '@/components/Message/MsgBar'

const Tooltip = ({ el, handler, msg }) => {
	const tooltipRef = useRef(null)
	const triangleRef = useRef(null)
	// 显示隐藏弹窗
	const [showToolTip, setShowToolTip] = useState(true)
	// 是否触发上下边界
	const [top, setTop] = useState(false)

	const tips = [
		{
			name: tooltipsType.COPY,
			title: '复制',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.FORWARD,
			title: '转发',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.EDIT,
			title: '编辑',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.DELETE,
			title: '删除',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.SELECT,
			title: '多选',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.REPLY,
			title: '回复',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: tooltipsType.MARK,
			title: '标注',
			icon: <ArrowUpRight className="tooltip__icon" />
		}
	]

	useClickOutside(tooltipRef, () => setShowToolTip(false))

	// 边界控制
	useEffect(() => {
		if (!el) return

		const tooltipEl = tooltipRef.current
		const elRect = el.getBoundingClientRect()

		// 控制上边界
		elRect.top < tooltipEl.offsetHeight + 56 ? setTop(true) : setTop(false)

		// 控制左右边界
		if (elRect.width <= 150) {
			const isLeft = elRect.left <= 50
			// 控制弹窗
			tooltipRef.current.style.left = isLeft ? '-40px' : 'auto'
			tooltipRef.current.style.right = isLeft ? 'auto' : '-40px'
			// 修改小三角的位置
			triangleRef.current.style.left = isLeft ? elRect.width / 2 + 40 + 'px' : 'auto'
			triangleRef.current.style.right = isLeft ? 'auto' : elRect.width / 2 + 40 + 'px'
		}
	}, [el])

	return showToolTip ? (
		<div
			className={clsx(
				'absolute w-[220px] bg-black text-white rounded z-[99] m-auto left-0 right-0 animate__animated  animate__faster animate__fadeIn',
				top ? 'top-[calc(100%+10px)] bottom-auto ' : 'bottom-[calc(100%+10px)] top-auto'
			)}
			ref={tooltipRef}
			style={{ '--animate-duration': '0.3s' }}
		>
			<div
				className={clsx(
					'absolute w-0 h-0 border-[5px] border-transparent m-auto left-0 right-0',
					top ? 'border-b-black bottom-full' : 'border-t-black top-full'
				)}
				ref={triangleRef}
			/>
			<div className="h-auto p-4 py-5">
				<div className="flex flex-wrap">
					{tips.map((item, index) => (
						<div key={item.name} className={clsx('w-1/4 p-2', index > 3 ? 'pb-0' : 'pt-0')}>
							<Link
								onClick={() => {
									setShowToolTip(false)
									handler(item.name, msg)
								}}
								className="w-full"
							>
								<div className="flex flex-col items-center justify-center">
									<div className="mb-[6px]">{item.icon}</div>
									<span className="text-[0.75rem]">{item.title}</span>
								</div>
							</Link>
							{index === 3 && <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)]" key={index} />}
						</div>
					))}
				</div>
			</div>
		</div>
	) : null
}

export default function Chat({ messages, header, footer, isFristIn, ...props }) {
	const chatRef = useRef(null)
	// const markdownRef = useRef(null)
	const msgRefs = useRef([])
	const toastRef = useRef([])
	// 打开关闭转发弹窗
	const [opened, setOpened] = useState(false)
	// 选中的消息
	const [msg, setMsg] = useState({})
	// 输入框默认值
	const [defaultMsg, setDefaultMsg] = useState({})
	// 发送类型 发送 ｜ 编辑  ｜ 回复
	const [type, setType] = useState(sendType.SEND)
	// 消息列表
	const memoizedMessages = useMemo(() => messages, [messages])
	// 根据id查找好友
	const findOne = (id) => props.list.find((v) => v?.user_id === id)

	/**
	 * Totast 提示
	 * @param {string} text 提示文字
	 */
	const toast = (text) => {
		toastRef.current = f7.toast.create({
			text: $t(text),
			position: 'center',
			closeTimeout: 1000
		})
		toastRef.current.open()
	}

	/**
	 * 平滑滚动或者直接滚动到底部
	 * @param {*} isSmooth 	是否平滑滚动
	 */
	const scroll = (isSmooth = false) => {
		isSmooth
			? chatRef.current.scrollTo({
					top: chatRef.current.scrollHeight,
					behavior: 'smooth'
				})
			: chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
	}

	useEffect(() => {
		scroll(true)
	}, [memoizedMessages])

	/**
	 * 长按事件回调
	 * @param {number} index 	当前长按元素的索引
	 */
	const handlerLongPress = (index, data) => {
		const div = document.createElement('div')
		createRoot(div).render(<Tooltip el={msgRefs.current[index]} handler={handlerSelect} msg={data} />)
		msgRefs.current[index].appendChild(div)
	}

	// eslint-disable-next-line no-unused-vars
	const [_, copy] = useClipboard()
	const copyString = (str) => {
		const doc = new DOMParser().parseFromString(str, 'text/html')
		copy(doc.body.textContent)
		toast('复制成功')
	}

	const handlerSelect = (type, data) => {
		// 当前选择的消息
		setMsg(data)

		console.log('data', data)

		switch (type) {
			case tooltipsType.FORWARD:
				setOpened(true)
				break
			case tooltipsType.EDIT:
				setDefaultMsg(data)
				setType(sendType.EDIT)
				break
			case tooltipsType.DELETE:
				props.sendDel && props.sendDel(data)
				break
			case tooltipsType.REPLY:
				setDefaultMsg(data)
				setType(sendType.REPLY)
				break
			case tooltipsType.COPY:
				copyString(data?.msg_content)
				break
		}
	}

	//  转发
	const sendForward = (list, msg) => {
		try {
			list.forEach(async (v) => {
				// TODO: 群聊
				if (v?.group_id) {
					console.log('群')
					return
				}

				const contact = await userService.findOneById(userService.TABLES.FRIENDS_LIST, v.dialog_id, 'dialog_id')
				await props.sendMessage(1, msg?.msg_content, {
					dialog_id: v.dialog_id,
					receiver_id: v.user_id,
					update: v?.dialog_id === msg?.dialog_id ? true : false,
					shareKey: contact?.shareKey
				})
			})
			toast('转发成功')
		} catch {
			toast('转发失败')
		}
	}

	// 点击发送按钮的回调
	const send = (content, type, msg) => {
		setType(sendType.SEND)
		props.send(content, type, msg)
	}

	return (
		<div className="w-full h-screen overflow-y-auto text-[0.888rem] bg-[#f8f8f8] relative" ref={chatRef}>
			{/* Header */}
			{header}

			{/* Content */}
			<div className="w-full py-20 pb-20 px-2">
				{memoizedMessages.map((msg, index) => (
					<div
						key={index}
						className={clsx(
							'w-full flex items-center mb-4 animate__animated  animate__fadeInUp',
							msg?.msg_is_self ? 'justify-end' : 'justify-start'
						)}
						style={{ '--animate-duration': '0.3s' }}
					>
						<div className="w-full flex justify-between">
							<div className=""></div>
							<div className="flex max-w-[80%] items-start">
								<img
									src={findOne(msg?.meg_sender_id)?.avatar}
									alt=""
									className={clsx(
										'w-8 h-8 rounded-full',
										msg?.msg_is_self ? 'order-last ml-2' : 'order-first mr-2'
									)}
								/>
								<div className="flex-1">
									<LongPressButton
										callback={() => handlerLongPress(index, msg)}
										className={clsx(
											'w-full mb-1 flex select-none h-auto',
											msg?.msg_is_self ? 'justify-end' : 'justify-start'
										)}
									>
										<div
											data-index={index}
											className={clsx(
												'relative flex w-[fit-content] break-all z-0',
												msg?.msg_is_self ? 'justify-end' : 'justify-start'
											)}
											ref={(el) => (msgRefs.current[index] = el)}
											id={'data-' + msg?.msg_id}
										>
											<div
												className={clsx(
													'p-3 rounded relative',
													'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:top-[10px] after:border-transparent',
													msg.msg_is_self
														? 'bg-primary text-white after:left-full after:border-l-primary'
														: 'bg-white after:right-full after:border-r-white'
												)}
											>
												<Editor readonly={true} defaultValue={msg?.msg_content} />
											</div>
										</div>
									</LongPressButton>
									<div
										className={clsx(
											'text-[0.75rem] text-gray-400 flex items-center mb-1',
											msg?.msg_is_self ? 'justify-end' : 'justify-start'
										)}
									>
										<span>{format(msg?.msg_send_time, 'zh_CN')}</span>
										{msg?.msg_is_self &&
											(msg?.msg_send_state === sendState.OK ? (
												<DoubleTickIcon />
											) : msg?.msg_send_state === sendState.ERROR ? (
												<Exclamationmark className="text-red-500" />
											) : (
												<Gobackward />
											))}
									</div>
									{msg?.replay_msg_id && (
										<a
											href={`#data-${msg?.replay_msg_id}`}
											className={clsx('flex', msg?.msg_is_self ? 'justify-end' : 'justify-start')}
										>
											<div
												className={clsx(
													'text-[0.71rem] w-[fit-content] max-w-[200px] bg-[#e7e7e7] px-2 rounded line-clamp-1 overflow-hidden !text-[#666]'
												)}
											>
												<Editor
													readonly={true}
													defaultValue={
														memoizedMessages.find((v) => v.msg_id === msg?.replay_msg_id)
															?.msg_content || ''
													}
													className="w-[fit-content] !text-[#666]"
												/>
											</div>
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* {footer} */}
			<MsgBar send={send} defaultMsg={defaultMsg} type={type} setType={setType} />

			<Contact
				title={$t('选择联系人')}
				opened={opened}
				setOpened={setOpened}
				send={(list) => sendForward(list, msg)}
			/>
		</div>
	)
}

Tooltip.propTypes = {
	el: PropType.any,
	handler: PropType.func,
	msg: PropType.object
}
Chat.propTypes = {
	messages: PropType.array.isRequired,
	header: PropType.node,
	footer: PropType.node,
	isFristIn: PropType.bool,
	handlerLongPress: PropType.func,
	list: PropType.array,
	sendForward: PropType.func,
	sendDel: PropType.func,
	sendMessage: PropType.func,
	send: PropType.func,
	edit: PropType.func
}
