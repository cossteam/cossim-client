import React, { useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { Page } from 'framework7-react'
import './Messages.less'
import { useUserStore } from '@/stores/user'
// import _ from 'lodash-es'
import { sendToUser } from '@/api/msg'
// import { getUserInfoApi } from '@/api/user'
import { encryptMessage, cretateNonce, decryptMessageWithKey } from '@/utils/tweetnacl'
import userService from '@/db'
import MessageBox from '@/components/Message/Chat'
import MsgBar from '@/components/Message/MsgBar'
import { ArrowLeftIcon, MoreIcon } from '@/components/Icon/Icon'
import { msgStatus, sendState } from '@/utils/constants'
import { handlerMsgType } from '@/helpers/handlerType'
// import { $t } from '@/i18n'
//
// import Contact from '@/components/Contact/Contact'

export default function MessagesPage({ f7route, f7router }) {
	// 会话 id
	const DIALOG_ID = parseInt(f7route.query.dialog_id)
	// 接收人 id
	const { id: RECEIVER_ID } = f7route.params

	// 用户信
	const { user } = useUserStore()
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
	// 好友信息列表
	const [friendsList, setFriendsList] = useState([])

	// 数据库所有消息
	const msgList = useLiveQuery(() => userService.findOneAll(userService.TABLES.USER_MSGS, 'dialog_id', DIALOG_ID))

	// 基本初始化
	const init = async () => {
		// 设置户消息
		let userContact = await userService.findOneById(userService.TABLES.FRIENDS_LIST, RECEIVER_ID, 'user_id')
		// if (!userContact) {
		// 	const res = await getUserInfoApi({ user_id: RECEIVER_ID })
		// 	if (res.code !== 200) return
		// 	return setContact(res.data)
		// }
		setFriendsList([userContact, user])
		setContact(userContact)
	}

	useEffect(() => {
		init()
	}, [])

	useEffect(() => {
		try {
			console.log('contact', contact)
			if (!contact?.shareKey) return
			// 只截取最新的 30 条消息，从后面往前截取
			const msgs = msgList?.msgs?.slice(-30) || []
			for (let i = 0; i < msgs.length; i++) {
				const msg = msgs[i]
				let content = msg.msg_content
				try {
					content = decryptMessageWithKey(content, msgList.shareKey)
				} catch (error) {
					console.log('解密失败：', error)
					content = '该消息解密失败'
				}
				msg.msg_content = content
			}
			setMessages(msgs)
			setTimeout(() => setIsActive(false), 0)
			console.log('msgList', msgList)
		} catch (error) {
			console.error('error', error)
		}
	}, [contact])

	useEffect(() => {
		// // 首次进来初始化消息列表,把解密的消息放入到这里
		// const initMsgs = async () => {
		// 	// try {
		// 	// 	return
		// 	// 	// console.log('contact', contact)
		// 	// 	// if (!contact?.shareKey) return
		// 	// 	// // 只截取最新的 30 条消息，从后面往前截取
		// 	// 	// const msgs = msgList?.msgs?.slice(-30) || []
		// 	// 	// for (let i = 0; i < msgs.length; i++) {
		// 	// 	// 	const msg = msgs[i]
		// 	// 	// 	let content = msg.msg_content
		// 	// 	// 	try {
		// 	// 	// 		content = decryptMessageWithKey(content, msgList.shareKey)
		// 	// 	// 	} catch (error) {
		// 	// 	// 		console.log('解密失败：', error)
		// 	// 	// 		content = '该消息解密失败'
		// 	// 	// 	}
		// 	// 	// 	msg.msg_content = content
		// 	// 	// }
		// 	// 	// setMessages(msgs)
		// 	// 	// setTimeout(() => setIsActive(false), 0)
		// 	// 	// console.log('msgList', msgList)
		// 	// } catch (error) {
		// 	// 	console.error('error', error)
		// 	// }
		// }

		const updateMsg = async () => {
			try {
				const lastMsg = msgList?.msgs?.at(-1) || []

				// 如果是发送消息
				if (isSend) {
					const msg = messages.at(-1)
					msg.msg_send_state = lastMsg?.msg_send_state
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
		// isActive ? initMsgs() : updateMsg()
		!isActive && updateMsg()
	}, [msgList])

	const sendMessage = async (type, content) => {
		if (isActive) setIsActive(false)
		setIsSend(true)

		// 加密消息
		const encrypted = encryptMessage(content, nonce, contact?.shareKey)

		console.log('tyoe', type)

		const msg = {
			msg_read_status: msgStatus.READ,
			msg_type: handlerMsgType(type),
			msg_content: encrypted,
			msg_id: null,
			msg_send_time: Date.now(),
			msg_is_self: true,
			meg_sender_id: user.user_id,
			dialog_id: DIALOG_ID,
			msg_send_state: sendState.LOADING
		}

		// 先假设发送是 ok 的
		setMessages([...messages, { ...msg, content, msg_send_state: sendState.LOADING }])

		// 发送消息
		try {
			const { code, data } = await sendToUser({
				content: encrypted,
				dialog_id: parseInt(DIALOG_ID),
				receiver_id: RECEIVER_ID,
				type
			})
			msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
			msg.msg_id = data?.msg_id
		} catch {
			msg.send_state = sendState.ERROR
		}

		// 添加到消息列表中，无论成功与否
		await userService.add(userService.TABLES.USER_MSGS, msg)

		// 更新会话
		const chat = await userService.findOneById(userService.TABLES.CHATS, DIALOG_ID, 'dialog_id')
		chat &&
			(await userService.update(userService.TABLES.CHATS, DIALOG_ID, {
				...chat,
				last_message: encrypted,
				msg_id: msg.msg_id,
				msg_type: msg.msg_type,
				send_time: msg.msg_send_time
			}))
	}

	/**
	 * 转发
	 * @param {Array} list 	需要转发的人或群列表
	 * @param {Object} msg 	要转发的消息
	 */
	const sendForward = async (list, msg) => {
		console.log('list', list, msg)
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
				footer={<MsgBar send={(content, type = 1) => sendMessage(type, content)} />}
				isFristIn={isActive}
				contact={contact}
				list={friendsList}
				sendForward={sendForward}
			/>
		</Page>
	)
}

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}
