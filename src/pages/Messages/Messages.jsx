import React, { useState, useEffect, useRef } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { Page, f7 } from 'framework7-react'
import './Messages.less'
import { useUserStore } from '@/stores/user'
// import _ from 'lodash-es'
import { sendToUser, editUserMsgApi } from '@/api/msg'
// import { getUserInfoApi } from '@/api/user'
import { encryptMessage, cretateNonce, decryptMessageWithKey } from '@/utils/tweetnacl'
import userService from '@/db'
import MessageBox from '@/components/Message/Chat'
import MsgBar from '@/components/Message/MsgBar'
import { ArrowLeftIcon, MoreIcon } from '@/components/Icon/Icon'
import { msgStatus, sendState, sendType } from '@/utils/constants'
import { handlerMsgType } from '@/helpers/handlerType'
import { $t } from '@/i18n'
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
	// 随机数
	const [nonce] = useState(cretateNonce())
	// 好友信息列表
	const [friendsList, setFriendsList] = useState([])

	// 提示消息
	const toastRef = useRef(null)

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
		const initMsg = async () => {
			try {
				// 只截取最新的 30 条消息，从后面往前截取
				const msgs = msgList?.slice(-30) || []
				if (msgs.length === 0) return

				for (let i = 0; i < msgs.length; i++) {
					const msg = msgs[i]
					let content = msg.msg_content
					try {
						content = decryptMessageWithKey(content, contact?.shareKey)
					} catch (error) {
						console.log('解密失败：', error)
						content = '该消息解密失败'
					}
					msg.msg_content = content
				}
				setMessages(msgs)
				setIsActive(false)
				console.log('msgList', messages, msgList)
			} catch (error) {
				console.error('error', error)
			}
		}

		const updateMsg = async () => {
			const lastMsg = msgList?.at(-1) || []
			const msg = messages.at(-1)
			setMessages([...messages.slice(0, -1), { ...lastMsg, msg_content: msg.msg_content }])
		}

		isActive ? initMsg() : updateMsg()
	}, [msgList])

	const createTotast = (msg) => {
		toastRef.current = f7.toast.create({
			text: $t(msg),
			position: 'center',
			closeTimeout: 1000
		})
		toastRef.current.open()
	}

	const sendMessage = async (type, content, options) => {
		if (isActive) setIsActive(false)

		// 一些额外的操作
		const {
			receiver_id = RECEIVER_ID,
			dialog_id = DIALOG_ID,
			update = true,
			shareKey = contact?.shareKey,
			replay_id
		} = options

		// 加密消息
		const encrypted = encryptMessage(content, nonce, shareKey)

		const msg = {
			msg_read_status: msgStatus.READ,
			msg_type: handlerMsgType(type),
			msg_content: encrypted,
			msg_id: Date.now(),
			msg_send_time: Date.now(),
			msg_is_self: true,
			msg_sender_id: user?.user_id,
			dialog_id,
			msg_send_state: sendState.LOADING,
			// 只有回复某条消息时需要带上该消息的 id
			replay_msg_id: replay_id || null
		}

		// 先假设发送是 ok 的
		update && setMessages([...messages, { ...msg, msg_content: content }])

		// 发送消息
		try {
			const { code, data } = await sendToUser({
				content: encrypted,
				dialog_id: parseInt(dialog_id),
				receiver_id,
				replay_id,
				type
			})
			msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
			msg.msg_id = data?.msg_id
		} catch {
			msg.msg_send_state = sendState.ERROR
		}

		// 添加到消息列表中，无论成功与否
		replay_id
			? await userService.add(userService.TABLES.USER_MSGS, msg)
			: await userService.update(userService.TABLES.USER_MSGS, msg.msg_id, msg, 'msg_id')

		// 更新会话
		// const chat = await userService.findOneById(userService.TABLES.CHATS, dialog_id, 'dialog_id')
		// chat &&
		// 	(await userService.update(userService.TABLES.CHATS, dialog_id, {
		// 		...chat,
		// 		last_message: encrypted,
		// 		msg_id: msg.msg_id ? msg.msg_id : chat?.msg_id,
		// 		msg_type: msg.msg_type,
		// 		send_time: msg.msg_send_time
		// 	}))
	}

	const send = async (content, type, msg) => {
		// console.log('msg', content, type, msg)
		switch (type) {
			case sendType.SEND:
				await sendMessage(1, content, {})
				break
			case sendType.EDIT:
				await sendEdit(content, msg)
				break
			case sendType.REPLY:
				await sendReply(content, msg)
				break
		}
	}

	// 删除
	const sendDel = async (msg) => {
		try {
			const id = msg?.msg_id ? msg.msg_id : msg.msg_send_time
			const key = msg?.msg_id ? 'msg_id' : 'msg_send_time'
			await userService.delete(userService.TABLES.USER_MSGS, id, key)
			setMessages(messages.filter((item) => item[key] !== id))
			createTotast('删除成功')
		} catch {
			createTotast('删除失败')
		}
	}

	// 编辑消息
	const sendEdit = async (content, msg) => {
		try {
			const encrypted = encryptMessage(content, nonce, contact?.shareKey)
			const reslut = await editUserMsgApi({ msg_id: msg.msg_id, content: encrypted, msg_type: 1 })

			if (reslut?.code === 200) {
				setMessages(
					messages.map((item) => (item.msg_id === msg.msg_id ? { ...item, msg_content: content } : item))
				)
				createTotast('编辑成功')

				const user = await userService.findOneById(userService.TABLES.USER_MSGS, msg.msg_id, 'msg_id')
				if (!user) return createTotast('编辑失败')

				await userService.update(
					userService.TABLES.USER_MSGS,
					msg.msg_id,
					{
						...user,
						msg_content: encrypted
					},
					'msg_id'
				)
			}
		} catch (error) {
			console.log('error', error)
			createTotast('编辑失败')
		}
	}

	// 回复
	const sendReply = async (content, msg) => {
		// send(msg.msg_content, sendType.SEND, msg)
		console.log('回复', content, msg)
		try {
			await sendMessage(1, content, {
				replay_id: msg.msg_id
			})
			// await userService.update(userService.TABLES.USER_MSGS, msg.msg_id, {})
			createTotast('回复成功')
		} catch (error) {
			console.log('error', error)
			createTotast('回复失败')
		}
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
				isFristIn={isActive}
				contact={contact}
				list={friendsList}
				sendDel={sendDel}
				sendMessage={sendMessage}
				send={send}
			/>
		</Page>
	)
}

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}
