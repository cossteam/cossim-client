import $ from 'dom7'
import React, { useRef, useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { f7, Navbar, Link, Page, Messages, Message, Messagebar, MessagebarSheet, Icon } from 'framework7-react'
// import DoubleTickIcon from '@/components/DoubleTickIcon'
// import Emojis from '@/components/Emojis/Emojis.jsx'
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
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}

export default function MessagesPage({ f7route, f7router }) {
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
	// 错误消息列表
	// const [errorMsg, setErrorMsg] = useState([])

	// 数据库所有消息\
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
		}
		init()
	}, [])

	useEffect(() => {
		// 首次进来初始化消息列表,把解密的消息放入到这里
		const initMsgs = async () => {
			try {
				console.log("msgList",msgList)
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
				console.log("msgList",msgList)
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
					content = decryptMessageWithKey(content, msgList.shareKey)
				} catch (error) {
					console.log('解密失败：', error)
					content = lastMsg?.content
				}
				lastMsg.content = content
				setMessages([...messages, lastMsg])
			} catch (error) {
				console.error('解析消息失败：', error.message)
			}
		}
		isActive ? initMsgs() : updateMsg()
	}, [msgList])

	// 发送消息
	// const messagebarRef = useRef(null)
	// const [messageText, setMessageText] = useState('')
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
		const reslutMsg = { status: 1, msg: 'ok' }
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
				const { code, data, msg } = await sendToUser(dbMsgToReqMsg(dbMsg))
				dbMsg.send_state = code === 200 ? 'ok' : 'error'
				dbMsg.msg_id = data?.msg_id
				reslutMsg.code = code === 200 ? 1 : 0
				reslutMsg.msg = msg
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
			return reslutMsg
		} catch (error) {
			console.error('发送消息失败：', error)
			// throw error
			return reslutMsg
		}
	}

	const send = async (content) => {
		return await sendMessage(1, content)
	}

	return (
		<Page className="messages-page" noToolbar>
			<MessageBox
				messages={messages}
				header={
					<div className="fixed top-0 left-0 right-0 h-14 border-b flex items-center px-4 z-[999] bg-white">
						<div className="flex items-center w-full">
							<ArrowLeftIcon className="w-5 h-5 mr-3" onClick={() => f7router.back()} />
							<div className="flex items-center">
								<img src={contact?.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
								<span>{contact?.nickname}</span>
							</div>
							<div className="flex-1 flex justify-end">
								<MoreIcon className="w-7 h-7" />
							</div>
						</div>
					</div>
				}
				footer={<MsgBar send={send} />}
				isFristIn={isActive}
				contact={contact}
			/>
		</Page>
	)
}
