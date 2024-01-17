import $ from 'dom7'
import React, { useRef, useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { f7, Navbar, Link, Page, Messages, Message, Messagebar, MessagebarSheet, Icon } from 'framework7-react'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import Emojis from './emojis/Emojis.jsx'
import './Messages.less'
import { useUserStore } from '@/stores/user'
import WebDB from '@/db'
import _ from 'lodash-es'
import { sendToUser } from '@/api/msg'
import { switchE2EKeyApi } from '@/api/relation'

import WebSocketClient from '@/utils/WebSocketClient'

// TODO: 添加好友时交换双方密钥（地址）
import Signal, { toArrayBuffer } from '@/utils/signal/signal-protocol'
import { SessionCipher, SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	// 会话信息
	const dialogId = f7route.query.dialog_id

	const [newSignal, setNewSignal] = useState(new Signal())

	// 用户信息
	const { user, signal, directory } = useUserStore()
	const UserId = user?.UserId

	// 地址
	const [address, setAddress] = useState()
	// 会话 session
	const [sessionCipher, setSessionCipher] = useState()

	// 好友信息
	const ReceiverId = f7route.params.id // 好友id/群聊id
	const [contact, setContact] = useState({})

	useEffect(() => {
		console.log('接收人', ReceiverId)
		if (!ReceiverId) return
		;async () => {
			const contact = await WebDB.contacts.where('user_id').equals(ReceiverId).first()
			setContact(contact || {})
		}
	}, [ReceiverId])

	// const DESKTOP1 = UserId
	// const DESKTOP2 = ReceiverId

	// 地址
	// const [address] = useState(new SignalProtocolAddress())
	// 会话 session
	// const [sessionCipher] = useState(new SessionCipher(signal.store, address))

	// 初始化
	async function init() {
		try {
			newSignal.store._store = toArrayBuffer(signal.store._store)

			// 获取对方信息
			const data = await WebDB.keypairs.where('user_id').equals(ReceiverId).first()

			// 如果找不到用户，就交换公钥
			const res = await switchE2EKeyApi({ user_id: ReceiverId, public_key: JSON.stringify(directory) })
			if (res.code !== 200) return f7.dialog.alert(res.msg)

			// 初始化地址
			const addr = new SignalProtocolAddress(data.deviceName, data.deviceId)
			// 初始化会话
			const cipher = new SessionCipher(newSignal.store, addr)

			setAddress(addr)
			setSessionCipher(cipher)

			delete data.deviceName
			delete data.user_id
			delete data.deviceId

			setNewSignal(newSignal)

			console.log('获取用户信息', data)

			// 创建会话
			await newSignal.cretaeSession(newSignal.store, addr, toArrayBuffer(data))
		} catch (error) {
			console.log('消息初始化失败', error)
		}
	}
	useEffect(() => {
		init()
	}, [])

	// 聊天记录
	// let pageNum = 1
	// let pageSize = 18
	// let total = 0
	// const messages = useLiveQuery(() => WebDB.messages.toArray()) || []
	const allMsg = useLiveQuery(() => WebDB.messages.toArray()) || []
	const [messages, setMessages] = useState([])

	// const [isActive, setIsActive] = useState(true)

	useEffect(() => {
		// ;(async() => {
		// 	if (allMsg.length > 0 && sessionCipher) {
		// 		// console.log(await newSignal.decrypt(JSON.parse(allMsg[0].content), sessionCipher))
		// 		console.log(allMsg);
		// 		console.log(allMsg.map(m => {
		// 			return newSignal.decrypt(JSON.parse(m.content), sessionCipher).then(e => {
		// 				console.log(e);
		// 				return e
		// 			})
		// 		}))
		// 	}
		// })()
		setMessages(allMsg)
	}, [allMsg, sessionCipher])

	// 倒序分页查询
	// async function reversePageQuery(pageSize, pageIndex) {
	// 	// 计算起始位置
	// 	const offset = (pageIndex - 1) * pageSize
	// 	// 执行倒序查询
	// 	console.log(pageSize, pageNum)
	// 	const arr = (
	// 		await WebDB.messages
	// 			.orderBy('id')
	// 			.reverse() // 倒序查询
	// 			.offset(offset)
	// 			.limit(pageSize)
	// 			.toArray()
	// 	).sort((a, b) => a.id - b.id) // 按照id倒序
	// 	console.log(messages)
	// 	console.log(arr)
	// 	const newArr = [...arr].concat([...messages])
	// 	console.log(newArr)
	// 	// setMessages(newArr)
	// 	arr && (pageNum += 1)
	// 	return arr
	// }
	// 获取服务端消息数据
	// const getMessage = () => {
	// 	return new Promise((resolve, reject) => {
	// 		getMsgByUser({
	// 			user_id: ReceiverId,
	// 			page_num: pageNum,
	// 			page_size: pageSize
	// 		})
	// 			.then(({ data }) => {
	// 				data = data?.msg_list || data
	// 				total = data?.total
	// 				if (total / pageSize > pageNum) {
	// 					pageNum += 1
	// 				}
	// 				resolve(data)
	// 			})
	// 			.catch((err) => {
	// 				reject(err)
	// 			})
	// 	})
	// }
	// 更新本地消息
	// const refreshMessage = async () => {
	// 	try {
	// 		const { user_messages } = await getMessage()
	// 		const respData = user_messages?.map((msg) => {
	// 			// id, sender_id, receiver_id, content, type, replay_id, is_read, read_at, created_at, dialog_id
	// 			// ||
	// 			// id, sender_id, receiver_id, content, type, replay_id, is_read, read_at, created_at, dialog_id, send_state
	// 			return {
	// 				...msg,
	// 				send_state: 'ok' // 'sending' => 'ok' or 'err'
	// 			}
	// 		})
	// 		console.log(respData)
	// 		const oldData = (await WebDB.messages.toArray()) || []
	// 		// 校验新数据和旧数据 => 更新数据 or 插入数据库
	// 		for (let i = 0; i < respData.length; i++) {
	// 			const item = respData[i]
	// 			const oldItem = oldData.find((oldItem) => oldItem.id === item.id)
	// 			oldItem ? await WebDB.messages.update(oldItem.id, item) : await WebDB.messages.add(item)
	// 		}
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	WebSocketClient.addListener('onMessage', async (message) => {
		if (sessionCipher) {
			console.log('message', message.data.content)
			const emd = await newSignal.decrypt(JSON.parse(message.data.content), sessionCipher)
			console.log('解密', emd)
		}
	})

	// 初始化后执行
	useEffect(() => {
		// refreshMessage()
		// reversePageQuery(pageSize, pageNum)
		const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
		// 滚动到顶部加载更多
		messagesContent?.addEventListener(
			'scroll',
			_.throttle(async () => {
				if (messagesContent.scrollTop === 0) {
					console.log('触顶')
					// await refreshMessage()
					// reversePageQuery(pageSize, pageNum)
				}
			}, 1000)
		)
		return () => {
			messagesContent?.removeEventListener('scroll', () => {})
		}
	}, [])

	// 消息渲染处理
	const messageTime = (message) => {
		return message?.created_at
			? Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.created_at))
			: ''
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
			const encrypted = await newSignal.encrypt(content, sessionCipher)
			console.log('发送消息', encrypted)
			let send_state = 'sending'
			const dbMsg = {
				sender_id: UserId,
				receiver_id: ReceiverId,
				type: 'sent', // 发送方
				content: JSON.stringify(encrypted),
				content_type: type, // 1: 文本, 2: 语音, 3: 图片
				date: new Date(),
				send_state,
				is_read: true
			}

			const msgId = await WebDB.messages.add(dbMsg)
			const { code } = await sendToUser(dbMsgToReqMsg(dbMsg))

			send_state = code === 200 ? 'ok' : 'error'

			await WebDB.messages.update(msgId, { send_state })

			return msgId
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	const sendTextMessage = async () => {
		sendMessage(1, messageText)
		// 恢复输入框状态
		setMessageText('')
		setTimeout(() => {
			messagebarRef.current.f7Messagebar().focus()
		})
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

			<Messages>
				{messages.map((message, index) => (
					<Message
						key={index}
						className="message-appear-from-bottom"
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						image={message.content_type === 3 ? [message.content] : []}
						type={messageType(message)}
						text={message.content_type === 3 ? '' : message.content}
					>
						<span slot="text-footer">
							{messageTime(message)}
							{/* 发送状态 */}
							{message?.send_state && message.type === 'sent' ? (
								message.send_state === 'ok' ? (
									<DoubleTickIcon />
								) : (
									// message.send_state
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
