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
import { sendToUser, getMsgByUser } from '@/api/msg'
import { getUserInfoApi } from '@/api/user'
import { encryptMessage, decryptMessage, cretateNonce } from '@/utils/tweetnacl'
import userService from '@/db'
import { useHistoryStore } from '@/stores/history'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

// function msgCompare(oldData, newData, index = 0) {
// 	const newLastMsg = newData[0]

// 	// 查询最新数据是否在旧数据中
// 	const current = oldData.findIndex((v) => v.id === newLastMsg.id)

// 	if (current !== -1) {
// 		msgCompare(oldData, newData, index++)
// 	}
// }

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
	// 预共享密钥
	const [preKey, setPreKey] = useState(null)
	// 随机数
	const [nonce] = useState(cretateNonce())

	const { ids } = useHistoryStore()

	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(30)

	// 数据库所有消息
	// const allMsg = useLiveQuery(() => userService.findAll(userService.TABLES.USERS)) || []
	const msgList = useLiveQuery(async () => {
		const msgs = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
		return { msgs: msgs?.data?.msgs, shareKey: msgs?.data?.shareKey }
	})

	useEffect(() => {
		// 基本初始化
		const init = async () => {
			const reslut = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
			if (!reslut) return
			setPreKey(reslut?.data?.shareKey)

			// 设置户消息
			let userContact = await userService.findOneById(userService.TABLES.CONTACTS, ReceiverId)
			if (!userContact) {
				const res = await getUserInfoApi({ user_id: ReceiverId })
				if (res.code !== 200) return
				setContact(res.data)
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
						const msg = JSON.parse(content)
						content = decryptMessage(msg.msg, msg.nonce, msgList.shareKey)
					} catch {
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
					const msg = JSON.parse(content)
					content = decryptMessage(msg.msg, msg.nonce, msgList.shareKey)
				} catch {
					// console.log('解密失败：', error)
					content = lastMsg?.content
					// const session = await updateSession(user?.user_id, ReceiverId)
					// const preKey = await importKey(session?.preKey)
					// setPreKey(preKey || '1')
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

	const handlerMsg = async () => {
		try {
			// 获取本地数据库中最后一条消息
			const lastMsg = msgList?.msgs?.at(-1)
			// 获取私聊消息
			const { code, data } = await getMsgByUser({ page_num: page, page_size: limit, user_id: ReceiverId })
			// 没有请求成功积极退出
			if (code !== 200) return
			// 远程消息中最后一条消息
			const lastDataMsg = data?.user_messages?.at(-1)

			// 如果已经是最新消息了，就需要再继续操作了
			if (lastMsg?.id === lastDataMsg?.id) return

			// 对比服务器上的消息和本地的消息，比较需要更新的消息
		} catch (error) {
			console.error('error', error)
		}
	}

	useEffect(() => {
		if (ids.includes[ReceiverId]) handlerMsg()
		// handlerMsg()
	}, [ids])

	// 消息渲染处理
	const messageTime = (message) => {
		return message?.created_at
			? Intl.DateTimeFormat('zh-CN', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.created_at))
			: ''
		// return format(message?.created_at, 'zh_CN')
	}
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
	const messageType = (message) => {
		return message.receiver_id === ReceiverId ? 'sent' : 'received'
	}

	// 发送消息
	const messagebarRef = useRef(null)
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
				encrypted = encryptMessage(content, nonce, preKey)
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
				msg_id: 0
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

			// 查找本地消息记录
			const result = await userService.findOneById(userService.TABLES.USERS, ReceiverId)
			result
				? await userService.update(userService.TABLES.USERS, ReceiverId, {
						user_id: ReceiverId,
						data: { ...result.data, msgs: [...result.data.msgs, { ...dbMsg, content: encrypted }] }
					})
				: await userService.add(userService.TABLES.USERS, {
						user_id: ReceiverId,
						data: {}
					})
		} catch (error) {
			console.error('发送消息失败：', error)
			// throw error
		}
	}

	const sendTextMessage = async () => {
		sendMessage(1, messageText)
		// 恢复输入框状态
		setMessageText('')
		messagebarRef.current.f7Messagebar().focus()
	}

	// 图片表情
	const [sheetVisible, setSheetVisible] = useState(false)
	const onEmojiSelect = ({ type, emoji }) => {
		console.log(type, emoji)
		type === 'emoji' && setMessageText(`${messageText}${emoji}`)
		type === 'img' && sendMessage(3, emoji)
	}

	// Fix for iOS web app scroll body when
	const resizeTimeout = useRef(null)
	const onViewportResize = () => {
		// setHeight(visualViewport.height - 88 + 'px')
		$('html, body').css('height', `${visualViewport.height}px`)
		$('html, body').scrollTop(0)
	}
	const onMessagebarFocus = () => {
		const { device } = f7
		if (!device.ios || device.cordova || device.capacitor) return
		clearTimeout(resizeTimeout.current)
		visualViewport.addEventListener('resize', onViewportResize)
	}
	const onMessagebarBlur = () => {
		const { device } = f7
		if (!device.ios || device.cordova || device.capacitor) return
		resizeTimeout.current = setTimeout(() => {
			visualViewport.removeEventListener('resize', onViewportResize)
			$('html, body').css('height', '')
			$('html, body').scrollTop(0)
		}, 100)
	}

	return (
		<Page className="messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink backLinkShowText={false}>
				<Link slot="right" iconF7="videocam" />
				<Link slot="right" iconF7="phone" />
				<Link slot="title" href={`/profile/${ReceiverId}/`} className="title-profile-link">
					<img src={contact?.avatar} loading="lazy" />
					<div>
						<div>{contact?.name}</div>
						<div className="subtitle">online</div>
					</div>
				</Link>
			</Navbar>
			<Messagebar
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
						<Link slot="inner-end" href="/camera/" iconF7="camera" />
						<Link slot="inner-end" iconF7="mic" />
					</>
				)}
				{/* 表情、图片选择 */}
				<MessagebarSheet>
					<Emojis onEmojiSelect={onEmojiSelect} />
				</MessagebarSheet>
			</Messagebar>

			{/* <MessageBox messages={messages} height={height} /> */}

			<Messages>
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
			</Messages>
		</Page>
	)
}
