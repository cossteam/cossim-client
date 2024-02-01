import React, { useEffect, useRef, useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { CopyIcon } from '@/components/Icon/Icon'
import { clsx } from 'clsx'
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
import { ArrowUpRight, Exclamationmark, Gobackward } from 'framework7-icons/react'
import { msgType, sendState } from '@/utils/constants'
import { Link } from 'framework7-react'
import Contact from '@/components/Contact/Contact'
import { $t } from '@/i18n'

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

const Tooltip = ({ el, handler, msg }) => {
	const tooltipRef = useRef(null)
	const triangleRef = useRef(null)
	// 显示隐藏弹窗
	const [showToolTip, setShowToolTip] = useState(true)
	// 是否触发上下边界
	const [top, setTop] = useState(false)

	const tips = [
		{
			name: 'forward',
			title: '转发',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: 'edit',
			title: '编辑',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: 'del',
			title: '删除',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: 'choice',
			title: '多选',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: 'reply',
			title: '回复',
			icon: <ArrowUpRight className="tooltip__icon" />
		},
		{
			name: 'mark',
			title: '标注',
			icon: <ArrowUpRight className="tooltip__icon" />
		}
	]

	useClickOutside(tooltipRef, () => setShowToolTip(false))

	useEffect(() => {
		// 边界控制
		if (el) {
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
						<>
							<Link
								className={clsx('w-1/4 p-2', index > 3 ? 'pb-0' : 'pt-0')}
								key={item.name}
								onClick={() => handler(item.name, msg)}
								panelOpen={item.name === 'forward' && 'contact-popup'}
							>
								<div className="flex flex-col items-center justify-center">
									<div className="mb-[6px]">{item.icon}</div>
									<span className="text-[0.75rem]">{item.title}</span>
								</div>
							</Link>
							{index === 3 && <div className="w-full h-[1px] bg-[rgba(255,255,255,0.2)]" key={index} />}
						</>
					))}
				</div>
			</div>
		</div>
	) : null
}

export default function Chat({ messages, header, footer, isFristIn, ...props }) {
	const chatRef = useRef(null)
	const markdownRef = useRef(null)
	const msgRefs = useRef([])

	const [opened, setOpened] = useState(false)
	const [msg, setMsg] = useState({})

	const [isFrist, setIsFrist] = useState(true)

	const memoizedMessages = useMemo(() => messages, [messages])

	const findOne = (id) => props.list.find((v) => v?.user_id === id)

	useEffect(() => {
		// 渲染 markdown
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
			chatRef.current.style.height = document.body.clientHeight + 'px'
			// 当前滚动条到底部的距离
			const scrollTop = chatRef.current.scrollTop
			// 总高度
			const scrollHeight = chatRef.current.scrollHeight
			// 可视高度
			const clientHeight = chatRef.current.clientHeight
			// 判断距离底部的距离有多少
			if (scrollHeight - clientHeight - scrollTop < 500) {
				scroll(false)
			}
		}

		scroll(false)

		window.addEventListener('resize', handelerSize)
		return () => {
			window.removeEventListener('resize', handelerSize)
		}
	}, [])

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
		isFrist && setIsFrist(false)
	}

	useEffect(() => {
		scroll(isFrist ? false : true)
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

	const handlerSelect = (type, data) => {
		// 当前选择的消息
		setMsg(data)

		console.log('type', type, data)

		switch (type) {
			case 'forward':
				setOpened(true)
				break
			case 'edit':
				props.sendEdit && props.sendEdit(data)
				break
			case 'del':
				props.sendDel && props.sendDel(data)
				break
		}
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
							msg.msg_is_self ? 'justify-end' : 'justify-start'
						)}
						style={{ '--animate-duration': '0.3s' }}
					>
						<div className="flex max-w-[80%] items-start">
							<img
								src={findOne(msg.meg_sender_id)?.avatar}
								alt=""
								className={clsx(
									'w-8 h-8 rounded-full',
									msg.msg_is_self ? 'order-last ml-2' : 'order-first mr-2'
								)}
							/>
							<div className="flex-1">
								<LongPressButton
									callback={() => handlerLongPress(index, msg)}
									className={clsx(
										'w-full mb-1 flex select-none h-auto',
										msg.msg_is_self ? 'justify-end' : 'justify-start'
									)}
								>
									<div
										data-index={index}
										className={clsx(
											'relative flex w-[fit-content] break-all',
											msg.msg_is_self ? 'justify-end' : 'justify-start'
										)}
										ref={(el) => (msgRefs.current[index] = el)}
									>
										{msg.msg_type === msgType.TEXT && (
											<div
												className={clsx(
													'p-3 rounded relative',
													'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:top-[10px] after:border-transparent',
													msg.msg_is_self
														? 'bg-primary text-white after:left-full after:border-l-primary'
														: 'bg-white after:right-full after:border-r-white'
												)}
											>
												{msg.msg_content}
											</div>
										)}

										{msg.msg_type === msgType.IMAGE && (
											<img
												src={msg.content}
												alt=""
												className="max-w-[80%] object-cover rounded"
											/>
										)}

										{/* {msg.msg_type === 'markdown' && (
											<div
												className={clsx(
													'p-3 rounded relative markdown-body',
													'after:block after:absolute after:w-0 after:h-0 after:border-[5px] after:top-[10px] after:border-transparent',
													msg.msg_is_self
														? 'bg-green-500 text-white after:left-full after:border-l-green-500'
														: 'bg-white after:right-full after:border-r-white'
												)}
												dangerouslySetInnerHTML={{
													__html: Marked.parse(msg.content)
												}}
												ref={markdownRef}
											/>
										)} */}
									</div>
								</LongPressButton>
								<div
									className={clsx(
										'text-[0.75rem] text-gray-400 flex items-center',
										msg.msg_is_self ? 'justify-end' : 'justify-start'
									)}
								>
									<span>{format(msg.msg_send_time, 'zh_CN')}</span>
									{msg.msg_is_self &&
										(msg.msg_send_state === sendState.OK ? (
											<DoubleTickIcon />
										) : msg.msg_send_state === sendState.ERROR ? (
											<Exclamationmark className="text-red-500" />
										) : (
											<Gobackward />
										))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{footer}

			<Contact
				title={$t('选择联系人')}
				opened={opened}
				setOpened={setOpened}
				send={(list) => props.sendForward(list, msg)}
			/>
		</div>
	)
}

PreHeader.propTypes = {
	text: PropType.string,
	lang: PropType.string
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
	sendEdit: PropType.func,
	sendDel: PropType.func
}
