import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { clsx } from 'clsx'
import 'highlight.js/styles/github.min.css'
import { useClickOutside } from '@reactuses/core'
import LongPressButton from './LongPressButton'
import PropType from 'prop-types'
import { format } from 'timeago.js'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import { ArrowUpRight, Exclamationmark, Gobackward, BookmarkFill } from 'framework7-icons/react'
import { sendType, sendState, tooltipsType } from '@/utils/constants'
import { Link, f7 } from 'framework7-react'
import Contact from '@/components/Contact/Contact'
import { $t } from '@/i18n'
import Editor from '@/components/Editor/Editor'
import MsgBar from '@/components/Message/MsgBar'
import { Checkbox } from 'antd-mobile'
import { useUserStore } from '@/stores/user'
import { ArrowLeftIcon, MoreIcon } from '@/components/Icon/Icon'
import { useMessageStore } from '@/stores/message'
import { useClipboard } from '@/shared/useClipboard'
import { Toast } from 'antd-mobile'

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
			title: msg?.is_marked ? '取消标注' : '标注',
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
			const isLeft = elRect.left <= 100
			// 控制弹窗
			tooltipEl.style.left = isLeft ? '-40px' : 'auto'
			tooltipEl.style.right = isLeft ? 'auto' : '-40px'
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

export default function Chat(props) {
	// 整个聊天框
	const chatRef = useRef(null)
	// 消息列表元素
	const msgRefs = useRef([])
	// toast 弹窗
	const toastRef = useRef([])

	// 打开关闭转发弹窗
	const [opened, setOpened] = useState(false)
	// 选中的消息
	const [msg, setMsg] = useState({})
	// 输入框默认值
	const [defaultMsg, setDefaultMsg] = useState({})
	// 发送类型 发送 ｜ 编辑  ｜ 回复
	const [type, setType] = useState(sendType.SEND)
	// 首次进入
	const [isFrist, setIsFrist] = useState(true)
	// 根据id查找好友
	const findOne = (id) => props.list.find((v) => v?.user_id === id)
	// 用户信息
	const { user } = useUserStore()
	// 消息管理
	const msgStore = useMessageStore()

	// 提示
	const toast = (text) => {
		toastRef.current = f7.toast.create({
			text: $t(text),
			position: 'center',
			closeTimeout: 1000
		})
		toastRef.current.open()
	}
	// 平滑滚动或者直接滚动到底部
	const scroll = (isSmooth = false) => {
		isSmooth
			? chatRef.current.scrollTo({
					top: chatRef.current.scrollHeight,
					behavior: 'smooth'
				})
			: chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
	}

	const init = async () => {
		if (!isFrist) {
			msgStore.updateMessage(props.msgList, user?.user_id)
			return
		}
		if (!props.msgList) return
		await msgStore.readMessage(props?.dialog_id, props?.is_group)
		props.is_group
			? await msgStore.initGroupMessage(props?.msgList, user?.user_id)
			: await msgStore.initFriendMessage(props?.msgList, user?.user_id, props?.receiver_id)

		if (isFrist && props.msgList) {
			// scroll(false)
			setIsFrist(false)
		}
	}

	useEffect(() => {
		const handler = () => {
			chatRef.current.height = document.documentElement.clientHeight

			console.log('document.documentElement.clientHeight', document.documentElement.clientHeight)
		}

		document.addEventListener('resize', handler)

		return () => {
			document.removeEventListener('resize', handler)
		}
	}, [])

	useEffect(() => {
		console.log('props', props)
		init()
	}, [props.msgList])

	useEffect(() => {
		scroll(isFrist ? false : true)
	}, [msgStore.message])

	/**
	 * 长按事件回调
	 * @param {number} index 	当前长按元素的索引
	 */
	const handlerLongPress = (index, data) => {
		// 如果是多选状态就不展示
		if (isSelect) return
		const div = document.createElement('div')
		createRoot(div).render(<Tooltip el={msgRefs.current[index]} handler={handlerSelect} msg={data} />)
		msgRefs.current[index].appendChild(div)
	}

	// 点击发送按钮的回调
	const send = (content, msgType, msg) => {
		// 编辑
		if (type === sendType.EDIT) {
			msgStore.editMessage(msgType, content, {
				is_group: props?.is_group,
				receiver_id: props?.receiver_id,
				user_id: user?.user_id,
				msg_id: msg?.msg_id
			})
		} else {
			msgStore.sendMessage(msgType, content, {
				is_group: props?.is_group,
				receiver_id: props?.receiver_id,
				dialog_id: props?.dialog_id,
				user_id: user?.user_id,
				replay_id: type === sendType.REPLY ? msg?.msg_id : null,
				group_id: props?.group_id
				// msg_read_destroy: props?.contact?.
			})
		}

		setMsg({})
		setSelectList([])
		setType(sendType.SEND)
	}

	const handlerSelect = async (type, data) => {
		// 当前选择的消息
		setMsg(data)

		console.log('选择类型：', type, '数据：', data)

		switch (type) {
			case tooltipsType.FORWARD:
				setOpened(true)
				break
			case tooltipsType.EDIT:
				setDefaultMsg(data)
				setType(sendType.EDIT)
				break
			case tooltipsType.DELETE:
				sendDel(data)
				break
			case tooltipsType.REPLY:
				setDefaultMsg(data)
				setType(sendType.REPLY)
				break
			case tooltipsType.COPY:
				sendCopy(data?.msg_content)
				break
			case tooltipsType.SELECT:
				setIsSelect(true)
				break
			case tooltipsType.MARK:
				sendMark(data)
				break
		}
	}

	// 复制
	const sendCopy = async (str) => {
		const doc = new DOMParser().parseFromString(str, 'text/html')
		const txt = doc.body.textContent
		const flag = useClipboard(txt)
		flag ? toast('复制成功') : toast('复制失败')
	}

	//  转发
	const sendForward = (list, msg) => {
		try {
			list.forEach((v) => {
				const msgList = Array.isArray(msg) ? msg.slice(0, -1) : [msg]
				msgList.forEach((item) => {
					msgStore.sendMessage(1, item?.msg_content, {
						is_group: v?.group_id ? true : false,
						receiver_id: v?.user_id,
						dialog_id: v?.dialog_id,
						user_id: user?.user_id,
						replay_id: type === sendType.REPLY ? msg?.id : null,
						group_id: v?.group_id ? v?.group_id : null,
						is_update: v?.dialog_id === item?.dialog_id ? true : false
					})
				})
			})
			toast('转发成功')
		} catch {
			toast('转发失败')
		}
	}

	// 删除
	const sendDel = async (msg) => {
		let success = true
		const msgList = Array.isArray(msg) ? msg : [msg]
		msgList.map(async (item) => {
			success = await msgStore.deleteMessage(item, props.is_group)
		})
		success ? Toast.show('删除成功') : Toast.show('删除失败')
	}

	// 多选
	const [isSelect, setIsSelect] = useState(false)
	const [selectList, setSelectList] = useState([])

	const selectChange = (msg) => {
		const index = selectList.findIndex((v) => v?.msg_id === msg.msg_id)
		if (index !== -1) {
			selectList.splice(index, 1)
			setSelectList([...selectList])
			return
		}
		setSelectList([...selectList, msg])
	}

	const select = (name) => {
		switch (name) {
			case tooltipsType.FORWARD:
				setOpened(true)
				break
			case tooltipsType.DELETE:
				sendDel(selectList)
				break
			case tooltipsType.MARK:
				sendMark(selectList)
				console.log('selectList', selectList)
				break
		}
		setIsSelect(!isSelect)
	}

	// 标注
	const sendMark = async (msg) => {
		const is_array = Array.isArray(msg)
		const list = is_array ? msg : [msg]
		let success = true
		let is_marked = true
		try {
			list.map(async (item) => {
				is_marked = !item?.is_marked || false
				const { code } = await msgStore.markMessage(item, is_marked, props?.is_group)
				success = code === 200 ? true : false
			})
			setMsg({})
			setSelectList([])
			if (is_array && success) return Toast.show($t('标注成功'))
			Toast.show(is_marked && success ? $t('标注成功') : $t('取消标注成功'))
		} catch {
			Toast.show($t('标注失败'))
		}
	}

	return (
		<div className="w-full h-screen overflow-y-auto text-[0.888rem] bg-[#f8f8f8] relative" ref={chatRef}>
			{/* Header */}
			<div className="fixed top-0 left-0 right-0 h-14 border-b flex items-center px-4 z-[999] bg-white">
				<div className="flex items-center w-full">
					<ArrowLeftIcon className="w-5 h-5 mr-3" onClick={() => props?.f7router.back()} />
					<div className="flex items-center">
						<img src={props?.contact?.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
						<span>{props?.contact?.nickname || props?.contact?.name}</span>
					</div>
					<div className="flex-1 flex justify-end">
						{isSelect ? (
							<Link
								onClick={() => {
									setIsSelect(false)
									setSelectList([])
								}}
							>
								取消
							</Link>
						) : (
							<Link
								href={
									props?.is_group
										? `/chatinfo/group/${props?.group_id}/`
										: `/profile/${props?.contact?.user_id}/?is_chat=1&dialog_id=${props?.dialog_id}`
								}
							>
								<MoreIcon className="w-7 h-7" />
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="w-full py-20 pb-20 px-2">
				{msgStore.message.map((msg, index) => (
					<div
						key={index}
						className={clsx(
							'w-full flex mb-4 animate__animated  animate__fadeInUp items-start gap-2',
							!isSelect && msg?.msg_is_self ? 'justify-end' : 'justify-start',
							isSelect && msg?.msg_is_self ? 'justify-between' : 'justify-start'
						)}
						style={{ '--animate-duration': '0.3s' }}
					>
						{isSelect && <Checkbox className="text-red-500 w-auto" onChange={() => selectChange(msg)} />}

						<div className={clsx('flex max-w-[80%] items-start', isSelect && 'max-w-[100%] flex-1')}>
							<img
								src={msg?.msg_is_self ? user?.avatar : findOne(msg?.msg_sender_id)?.avatar}
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
											'relative flex w-[fit-content] break-all',
											msg?.msg_is_self ? 'justify-end' : 'justify-start'
										)}
										ref={(el) => (msgRefs.current[index] = el)}
										id={'data-' + msg?.msg_id}
									>
										<div
											className={clsx(
												'px-3 py-1 rounded relative',
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
									<div
										className={clsx(
											'flex items-center',
											msg?.msg_is_self ? 'order-first' : 'order-last'
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
									{msg?.is_marked && <BookmarkFill className="text-primary" />}
								</div>

								{/* 回复消息 */}
								{msg?.replay_msg_id ? (
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
													props?.msgList?.find((v) => v.msg_id === msg?.replay_msg_id)
														?.msg_content || ''
												}
												className="w-[fit-content] !text-[#666]"
											/>
										</div>
									</a>
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* {footer} */}
			<MsgBar
				send={send}
				defaultMsg={defaultMsg}
				type={type}
				setType={setType}
				onMoreSelect={props?.onMoreSelect}
				isSelect={isSelect}
				select={select}
				is_group={props?.is_group}
				list={props?.list}
			/>

			<Contact
				title={$t('选择联系人')}
				opened={opened}
				setOpened={setOpened}
				send={(list) => sendForward(list, [...selectList, msg])}
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
	list: PropType.array,
	sendForward: PropType.func,
	sendDel: PropType.func,
	sendMessage: PropType.func,
	send: PropType.func,
	edit: PropType.func,
	onMoreSelect: PropType.func,
	contact: PropType.object,
	f7router: PropType.object,
	msgList: PropType.array,
	is_group: PropType.bool,
	receiver_id: PropType.string,
	dialog_id: PropType.number,
	group_id: PropType.number
}
