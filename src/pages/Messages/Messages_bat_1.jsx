import $ from 'dom7'
import React, { useRef, useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { f7, Navbar, Link, Page, Messages, Message, Messagebar, MessagebarSheet, Icon } from 'framework7-react'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import Emojis from '@/components/Emojis/Emojis.jsx'
import './Messages.less'
import { useUserStore } from '@/stores/user'
import _ from 'lodash-es'
import { sendToUser } from '@/api/msg'
import { getUserInfoApi } from '@/api/user'
import { encryptMessage, cretateNonce, decryptMessageWithKey } from '@/utils/tweetnacl'
import userService from '@/db'
// import { useHistoryStore } from '@/stores/history'
// import Camera from '@/components/Camera/Camera'
import MessageBox from '@/components/Message/Chat'
import MsgBar from '@/components/Message/MsgBar'
import { ArrowLeftIcon, MoreIcon } from '@/components/Icon/Icon'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	// 会话信息
	const dialogId = f7route.query.dialog_id
	// 用户信息
	const { user } = useUserStore()
	// 好友id/群聊id
	const ReceiverId = f7route.params.id
	// 好友信息
	const [contact, setContact] = useState({})
	// 页面显示消息列表
	const [messages, setMessages] = useState([])
	// 是否首次进入
	const [isActive, setIsActive] = useState(true)
	// 是否是发送方
	const [isSend, setIsSend] = useState(false)
	// 随机数
	const [nonce] = useState(cretateNonce())

	// 数据库所有消息
	// const allMsg = useLiveQuery(() => userService.findAll(userService.TABLES.USERS)) || []
	const msgList = useLiveQuery(async () => {
		const msgs = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
		return { msgs: msgs?.data?.msgs, shareKey: msgs?.data?.shareKey }
	})

	useEffect(() => {
		// 基本初始化
		const init = async () => {
			// 设置户消息
			let userContact = await userService.findOneById(userService.TABLES.CONTACTS, ReceiverId)
			if (!userContact) {
				const res = await getUserInfoApi({ user_id: ReceiverId })
				if (res.code !== 200) return
				return setContact(res.data)
			}
			setContact(userContact)
			// 触顶加载
			// const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
			// 滚动到顶部加载更多
			// messagesContent?.addEventListener(
			// 	'scroll',
			// 	_.throttle(async () => {
			// 		if (messagesContent.scrollTop === 0) {
			// 			console.log('触顶')
			// 		}
			// 	}, 1000)
			// )
			// return () => {
			// 	messagesContent?.removeEventListener('scroll', () => {})
			// }
		}
		init()
	}, [])

	useEffect(() => {
		// 首次进来初始化消息列表,把解密的消息放入到这里
		const initMsgs = async () => {
			try {
				if (!msgList?.shareKey) return
				// console.log(msgList?.shareKey)
				// 只截取最新的 30 条消息，从后面往前截取
				const msgs = msgList?.msgs?.slice(-30) || []
				for (let i = 0; i < msgs.length; i++) {
					const msg = msgs[i]
					let content = msg.content
					try {
						content = decryptMessageWithKey(content, msgList.shareKey)
					} catch (error) {
						console.log('解密失败：', error)
						content = '该消息解密失败'
					}
					msg.content = content
				}
				setMessages(msgs)
				setTimeout(() => setIsActive(false), 0)
				// initServerMsgs()
			} catch (error) {
				console.error('error', error)
			}
		}

		const updateMsg = async () => {
			try {
				const lastMsg = msgList?.msgs?.at(-1) || []

				// 如果是发送消息
				if (isSend) {
					const msg = messages.at(-1)
					msg.send_state = lastMsg?.send_state
					setIsSend(false)
					setMessages(messages)
					return
				}

				// 如果是接收消息
				let content = lastMsg?.content
				try {
					// const msg = JSON.parse(content)
					content = decryptMessageWithKey(content, msgList.shareKey)
				} catch (error) {
					console.log('解密失败：', error)
					content = lastMsg?.content
				}
				lastMsg.content = content
				// console.log('lastMsg', lastMsg, messages)
				setMessages([...messages, lastMsg])
			} catch (error) {
				console.error('解析消息失败：', error.message)
			}
		}
		isActive ? initMsgs() : updateMsg()
	}, [msgList])

	// 消息渲染处理
	// const messageTime = (message) => {
	// 	return message?.created_at
	// 		? Intl.DateTimeFormat('zh-CN', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.created_at))
	// 		: ''
	// 	// return format(message?.created_at, 'zh_CN')
	// }
	// const isMessageFirst = (message) => {
	// 	const messageIndex = messages.indexOf(message)
	// 	const previousMessage = messages[messageIndex - 1]
	// 	return !previousMessage || previousMessage.type !== message.type
	// }
	// const isMessageLast = (message) => {
	// 	const messageIndex = messages.indexOf(message)
	// 	const nextMessage = messages[messageIndex + 1]
	// 	return !nextMessage || nextMessage.type !== message.type
	// }
	// const messageType = (message) => {
	// 	return message.receiver_id === ReceiverId ? 'sent' : 'received'
	// }

	// 发送消息
	// const messagebarRef = useRef(null)
	const [messageText, setMessageText] = useState('')
	const dbMsgToReqMsg = (obj) => {
		return {
			..._.mapKeys(_.pick(obj, ['content', 'receiver_id', 'content_type']), (value, key) => {
				if (key === 'content_type') return 'type'
				return key
			}),
			dialog_id: parseInt(dialogId)
		}
	}

	const sendMessage = async (type, content) => {
		try {
			if (isActive) setIsActive(false)
			let encrypted = ''
			try {
				encrypted = encryptMessage(content, nonce, msgList.shareKey)
				console.log('发送加密消息', encrypted)
			} catch {
				// 加密失败就返回原文
				encrypted = content
			}
			const msg = { msg: encrypted, nonce }
			encrypted = JSON.stringify(msg)

			let send_state = 'sending'
			const dbMsg = {
				sender_id: user.user_id,
				receiver_id: ReceiverId,
				// 发送方
				type: 'sent',
				content: encrypted,
				// 1: 文本, 2: 语音, 3: 图片
				content_type: type,
				send_time: Date.now(),
				send_state,
				is_read: true,
				msg_id: null
			}
			setIsSend(true)
			// 先假设发送是 ok 的
			setMessages([...messages, { ...dbMsg, content, send_state: 'ok' }])

			// 发送消息接口
			try {
				const { code, data } = await sendToUser(dbMsgToReqMsg(dbMsg))
				dbMsg.send_state = code === 200 ? 'ok' : 'error'
				dbMsg.msg_id = data?.msg_id
			} catch (error) {
				console.error('发送失败', error)
				dbMsg.send_state = 'error'
			}

			// 更新本地消息记录
			const result = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
			result
				? await userService.update(userService.TABLES.USERS, ReceiverId, {
						user_id: ReceiverId,
						data: { ...result.data, msgs: [...result.data.msgs, { ...dbMsg, content: encrypted }] }
					})
				: await userService.add(userService.TABLES.USERS, {
						user_id: ReceiverId,
						data: {
							msgs: [dbMsg],
							shareKey: null,
							dialog_id: null
						}
					})

			// 更新本地会话
			const chats = await userService.findOneById(userService.TABLES.CHATS, ReceiverId, 'user_id')

			chats &&
				(await userService.update(
					userService.TABLES.CHATS,
					ReceiverId,
					{
						...chats,
						last_message: encrypted,
						msg_id: dbMsg.msg_id ? dbMsg.msg_id : chats.msg_id
					},
					'user_id'
				))
		} catch (error) {
			console.error('发送消息失败：', error)
			// throw error
		}
	}

	// const sendTextMessage = async () => {
	// 	sendMessage(1, messageText)
	// 	// 恢复输入框状态
	// 	setMessageText('')
	// 	// 混搭
	// 	messagebarRef.current.f7Messagebar().focus()
	// 	// onViewportResize()
	// 	$('html, body').scrollTop(0)

	// 	console.log($('html, body'))
	// }

	// 图片表情
	// const [sheetVisible, setSheetVisible] = useState(false)
	// const onEmojiSelect = ({ type, emoji }) => {
	// 	console.log(type, emoji)
	// 	type === 'emoji' && setMessageText(`${messageText}${emoji}`)
	// 	type === 'img' && sendMessage(3, emoji)
	// }

	// Fix for iOS web app scroll body when
	// const resizeTimeout = useRef(null)
	// const onViewportResize = () => {
	// 	// setHeight(visualViewport.height - 88 + 'px')
	// 	$('html, body').css('height', `${visualViewport.height}px`)
	// 	$('html, body').scrollTop(0)
	// }
	// const onMessagebarFocus = () => {
	// 	const { device } = f7
	// 	if (!device.ios || device.cordova || device.capacitor) return
	// 	clearTimeout(resizeTimeout.current)
	// 	visualViewport.addEventListener('resize', onViewportResize)
	// }
	// const onMessagebarBlur = () => {
	// 	const { device } = f7
	// 	if (!device.ios || device.cordova || device.capacitor) return
	// 	resizeTimeout.current = setTimeout(() => {
	// 		visualViewport.removeEventListener('resize', onViewportResize)
	// 		$('html, body').css('height', '')
	// 		$('html, body').scrollTop(0)
	// 	}, 100)
	// }

	return (
		<Page className="messages-page" noToolbar>
			{/* <Navbar className="messages-navbar" backLink backLinkShowText={false}>
				<Link slot="right" iconF7="videocam" />
				<Link slot="right" iconF7="phone" />
				<Link slot="title" href={`/profile/${ReceiverId}/`} className="title-profile-link">
					<img src={contact?.avatar} loading="lazy" />
					<div>
						<div>{contact?.name}</div>
						<div className="subtitle">online</div>
					</div>
				</Link>
			</Navbar> */}
			{/* <Messagebar
				ref={messagebarRef}
				placeholder=""
				value={messageText}
				sheetVisible={sheetVisible}
				onInput={(e) => setMessageText(e.target.value)}
				onFocus={onMessagebarFocus}
				onBlur={onMessagebarBlur}
			>
				<Link slot="inner-start" iconF7="plus" />
				<Link
					className="messagebar-sticker-link"
					slot="after-area"
					iconF7="smiley"
					onClick={() => {
						setSheetVisible(!sheetVisible)
					}}
				/>
				{messageText.trim().length ? (
					<Link
						slot="inner-end"
						className="messagebar-send-link"
						iconF7="paperplane_fill"
						onClick={sendTextMessage}
					/>
				) : (
					<>
						<Link slot="inner-end" iconF7="camera" href="/camera/" />
						<Link slot="inner-end" iconF7="mic" />
					</>
				)}
				<MessagebarSheet>
					<Emojis onEmojiSelect={onEmojiSelect} />
				</MessagebarSheet>
			</Messagebar> */}

			{/* <div slot="page-content"> */}
			<MessageBox
				messages={messages}
				header={
					<div className="fixed top-0 left-0 right-0 h-14 border-b flex items-center px-4 z-[999] bg-white">
						<div className="flex items-center w-full">
							<ArrowLeftIcon className="w-5 h-5 mr-3" />
							<div className="flex items-center">
								<img src="https://picsum.photos/200" alt="" className="w-8 h-8 rounded-full mr-2" />
								<span>test</span>
							</div>
							<div className="flex-1 flex justify-end">
								<MoreIcon className="w-7 h-7" />
							</div>
						</div>
					</div>
				}
				footer={<MsgBar />}
			/>
			{/* </div> */}

			{/* <Messages>
				{messages.map((message, index) => (
					<Message
						key={index}
						className="message-appear-from-bottom"
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						image={message.content_type === 3 ? [message.content] : ''}
						type={messageType(message)}
						text={message.content_type === 3 ? '' : message.content}
					>
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
			</Messages> */}
		</Page>
	)
}
