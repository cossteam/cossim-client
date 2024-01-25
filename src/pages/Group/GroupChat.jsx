import React, { useState, useEffect, useRef } from 'react'
import {
	Icon,
	Link,
	Message,
	Messagebar,
	MessagebarSheet,
	Messages,
	NavRight,
	NavTitle,
	Navbar,
	Page
} from 'framework7-react'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import Emojis from '@/components/Emojis/Emojis.jsx'
import PropType from 'prop-types'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'
import { dbService } from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { uniqueId } from 'lodash-es'
import { groupInfoApi, groupMemberApi } from '@/api/group'
import { sendToGroup } from '@/api/msg'
import clsx from 'clsx'
import LongPressWrap from './LongPressWrap'
import { useClickOutside } from '@reactuses/core'

GroupChat.propTypes = {
	f7route: PropType.object.isRequired
}
export default function GroupChat({ f7route }) {
	const { user } = useUserStore()
	const ReceiverId = f7route.params.id // 群号 /（TODO：用户ID）
	const DialogId = f7route.query.dialog_id // 会话 ID
	const [chatInfo, setGroupInfo] = useState({}) // 群聊信息
	const [member, setMember] = useState(new Map()) // 成员信息

	// 消息处理（加密、解密）
	const msgHendler = (message) => {
		return message
	}
	// 消息列表
	const messages = useLiveQuery(async () => {
		const allMsg = (await dbService.findOneById(dbService.TABLES.MSGS, ReceiverId))?.data || []
		return allMsg.map((msgItem) => msgHendler(msgItem))
	})
	useEffect(() => {
		// 获取群聊信息
		groupInfoApi({ gid: ReceiverId }).then(({ code, data }) => {
			code === 200 && setGroupInfo(data)
		})
		// 获取成员信息
		groupMemberApi({ group_id: ReceiverId }).then(({ code, data }) => {
			if (code === 200) {
				const obj = new Map()
				for (const dataItem of Array.isArray(data) ? data : []) {
					if (dataItem.user_id) {
						obj.set(dataItem.user_id, dataItem)
					}
				}
				setMember(obj)
			}
		})
	}, [])

	// 发送消息
	const messagebarRef = useRef(null)
	const [msgText, setMsgText] = useState('')
	const messageTime = (message) => {
		return message?.time
			? Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.time))
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
	const sendStatusToText = (code) => {
		const status = {
			0: '未发送',
			1: '发送中',
			2: '发送成功',
			3: '发送失败'
		}
		return status[code] ? status[code] : '未知状态'
	}
	// 发送状态图标
	const sendStatusIcon = (message) => {
		if (message?.send_status === undefined) return sendStatusToText(message?.send_status)
		switch (message.send_status) {
			case 2:
				return (
					<span className="mb-2 mr-2 text-xs">
						<DoubleTickIcon />
					</span>
				)
			default:
				return (
					<Icon
						className="mb-2 mr-2 text-sm"
						f7={message.send_status == 1 ? 'slowmo' : 'wifi_slash'}
						color="primary"
					/>
				)
		}
	}

	const send = () => {
		sendMessage(msgText, 1)
		// 恢复输入框状态
		setMsgText('')
		messagebarRef.current.f7Messagebar().focus()
	}

	/**
	 * 发送消息
	 * @param {*} sandText 内容
	 * @param {*} type 内容类型 1:文本 2:语音 3:图片
	 * @returns
	 */
	const sendMessage = async (sandText = msgText, type = 1) => {
		if (sandText === '') return
		// 发送消息
		const time = Date.now()
		const unique_id = uniqueId(`${time}_`)
		const message = {
			unique_id,
			content: sandText, // 内容
			sender: user.user_id, // 发送人
			dialog_id: parseInt(DialogId), // 会话
			group_id: parseInt(ReceiverId), // 群组(私聊时为receiver_id)
			// receiver_id: parseInt(ReceiverId), // 接收人(群聊时为group_id)
			time, // 时间
			type, // 1:文本 2:语音 3:图片
			send_status: 0 // 0:未发送 1:发送中 2:发送成功 3:发送失败
		}
		console.log('发送消息', message)
		const newAllMsg = {
			user_id: ReceiverId,
			data: [...messages, message]
		}
		// 存入本地数据库
		if (messages.length === 0) {
			await dbService.add(dbService.TABLES.MSGS, newAllMsg)
		} else {
			await dbService.update(dbService.TABLES.MSGS, ReceiverId, newAllMsg)
		}
		// 发送
		try {
			message['send_status'] = 1
			dbService.update(dbService.TABLES.MSGS, ReceiverId, newAllMsg)
			const { code } = await sendToGroup({
				content: JSON.stringify(message),
				dialog_id: message.dialog_id,
				group_id: message.group_id,
				type: message.type
			})
			message['send_status'] = code === 200 ? 2 : 3
		} catch (error) {
			console.log(error)
			message['send_status'] = 3
		} finally {
			dbService.update(dbService.TABLES.MSGS, ReceiverId, newAllMsg)
		}
	}

	// 图片表情
	const [sheetVisible, setSheetVisible] = useState(false)
	const onEmojiSelect = ({ type, emoji }) => {
		type === 'emoji' && setMsgText(`${msgText}${emoji}`)
		type === 'img' && sendMessage(emoji, 3)
	}

	// 消息操作菜单
	const messagesRef = useRef(null)
	const [msgMenuData, setMsgMenuData] = useState({})
	const msgMenuRef = useRef(null)
	const [msgMenuStyle, setMsgMenuStyle] = useState({
		top: '44px',
		left: '9999px'
	})
	const onMsgLongPress = (e, msg) => {
		const isSender = msg.sender === user.user_id
		console.log(msg)
		console.dir(e.changedTouches[0].target.parentElement.getBoundingClientRect())
		// const clientWidth = msgMenuRef?.current?.clientWidth || 0
		// const clientHeight = msgMenuRef?.current?.clientHeight || 0
		// console.log(clientWidth, clientHeight)
		// const { offsetWidth, offsetHeight } = messagesRef.current.el.offsetParent
		// const maxWidth = offsetWidth
		// const maxHeight = offsetHeight - 88
		// console.log(maxWidth, maxHeight)
		// const { clientX, clientY } = e.changedTouches[0]
		// console.log(clientX, clientY)
		// let x = Math.floor(clientX)
		// let y = Math.floor(clientY)
		// let translateX = '0'
		// let translateY = '-50%'
		// // 菜单超出屏幕宽度
		// if (clientX + clientWidth >= maxWidth) {
		// 	x = Math.floor(clientX - clientWidth)
		// }
		// // 菜单超出屏幕高度
		// if (clientY + clientHeight >= maxHeight) {
		// 	y = Math.floor(clientY - clientHeight)
		// }
		const { top, left, bottom, right, width, height } =
			e.changedTouches[0].target.parentElement.getBoundingClientRect()

		setMsgMenuData(msg)
		// 开启消息菜单操作
		setMsgMenuStyle({
			left: isSender ? left + width : left,
			top: top
			// transform: `translate(${translateX}, ${translateY})`
		})
	}
	useClickOutside(msgMenuRef, () => {
		// 关闭消息菜单操作
		setMsgMenuStyle({
			left: '99999px'
		})
	})

	return (
		<Page className="chat-group-page messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<span className="">{$t(chatInfo.name)}</span>
				</NavTitle>
				<NavRight>
					<Link href={`/new_group/?id=${ReceiverId}`} iconF7="ellipsis" onClick={() => {}} />
				</NavRight>
			</Navbar>
			{/* 消息输入框 */}
			<Messagebar
				ref={messagebarRef}
				sheetVisible={sheetVisible}
				value={msgText}
				placeholder={$t('请输入消息')}
				onInput={(e) => setMsgText(e.target.value)}
			>
				<Link slot="inner-start" iconF7="plus" />
				<Link
					slot="after-area"
					className="messagebar-sticker-link"
					iconF7="smiley"
					onClick={() => {
						setSheetVisible(!sheetVisible)
					}}
				/>
				{msgText !== '' ? (
					<Link slot="inner-end" className="messagebar-send-link" iconF7="paperplane_fill" onClick={send} />
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
			<Messages ref={messagesRef}>
				{messages?.map((message, index) => {
					const first = isMessageFirst(message)
					// const last = isMessageLast(message)
					const tail = isMessageLast(message)
					const isSender = message.sender === user.user_id
					return (
						<div key={index} className="messages">
							{/* 消息 */}
							<Message
								first={first}
								last={true}
								tail={false}
								name={member.get(message.sender)?.nickname}
								avatar={member.get(message.sender)?.avatar}
								type={message.sender === user.user_id ? 'sent' : 'received'}
							>
								<LongPressWrap
									className={clsx(message.type === 3 && 'message-image')}
									onLongPress={(e) => onMsgLongPress(e, message)}
								>
									{message.type === 3 ? <img slot="image" src={message.content} /> : ''}
									{message.type === 1 ? <span slot="text">{message.content}</span> : ''}
								</LongPressWrap>
							</Message>
							{/* 时间、状态 */}
							<div
								className={clsx(
									'mt-1 pl-14 pr-8 flex flex-row justify-between items-center text-xs text-gray-500',
									isSender && 'message-sent'
								)}
							>
								{tail && <span className={clsx(isSender && 'mr-2')}>{messageTime(message)}</span>}
								{isSender && <span>{sendStatusIcon(message)}</span>}
							</div>
						</div>
					)
				})}
			</Messages>
			<div
				ref={msgMenuRef}
				className=" w-44 h-28 fixed z-[999] bg-white p-2 rounded-md shadow-md"
				style={msgMenuStyle}
			>
				{msgMenuData.content}
			</div>
		</Page>
	)
}
