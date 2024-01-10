import $ from 'dom7'
import React, { useRef, useState } from 'react'
import { f7, Navbar, Link, Page, /*List, ListItem,*/ Messages, Message, Messagebar } from 'framework7-react'
import './Messages.less'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { sendToUser } from '@/api/msg'
import { useEffect } from 'react'
import _ from 'lodash-es'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useUserStore } from '@/stores/user'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	const { user } = useUserStore()
	const senderId = user?.UserId
	const receiverId = f7route.params.id // 好友id/群聊id
	const dialogId = f7route.query.dialog_id

	// 联系人
	const [contact, setContact] = useState({})
	useEffect(() => {
		if (!receiverId) return
		WebDB.contacts
			.where('user_id')
			.equals(receiverId)
			.first()
			.then((contact) => {
				setContact(contact)
			})
	}, [receiverId])

	/*
	// 获取消息
	let pageNum = 1
	let pageSize = 20
	let total = 0
	const getMessage = () => {
		return new Promise((resolve, reject) => {
			getMsgByUser({
				user_id: receiverId,
				page_num: pageNum,
				page_size: pageSize
			})
				.then(({ data }) => {
					data = data?.msg_list || data
					total = data?.total
					console.log(data)
					resolve(data)
				})
				.catch((err) => {
					reject(err)
				})
				.finally(() => {
					if (total / pageSize === 0) return
					pageNum += 1
				})
		})
	}
	useEffect(() => {
		getMessage().then(({ user_messages }) => {
            const messages = user_messages?.map((msg) => {
                // Id, SenderId, ReceiverId, Content, Type, CreatedAt
                // ||
                // sender_id, receiver_id, text, type, date, send_state, is_read
                return {
                    ...msg,
                    type: msg.Type,
                    date: msg.created_at,
                    send_state: 'sending', // 'sending' => 'ok' or 'err'
                    is_read: true // TODO: 是否已读
                }
            })
			WebDB.messages
            .bulkPut(messages)
            .then(() => {
                console.log('消息插入成功！')
            })
            .catch((error) => {
                console.error('消息插入失败:', error)
            })
		})
	}, [])
    */

	// 聊天记录
	const messages = useLiveQuery(() => WebDB.messages.toArray()) || []
	// 滚动到顶部加载更多
	useEffect(() => {
		const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
		messagesContent?.addEventListener(
			'scroll',
			_.throttle(() => {
				if (messagesContent.scrollTop === 0) {
					console.log('已滚动到顶部')
				}
			}, 1000)
		)
	}, [])

	// 虚拟列表
	const messagesRef = useRef(null)
	// const [vlData, setVlData] = useState({
	// 	items: []
	// })
	// const renderExternal = (vl, newData) => {
	// 	console.table(newData.items)
	// 	setVlData({ ...newData })
	// }

	// 消息渲染处理
	const messageTime = (message) => {
		return message?.date
			? Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.date))
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

	// 发送消息
	const messagebarRef = useRef(null)
	const [messageText, setMessageText] = useState('')
	const sendMessage = async () => {
		const message = {
			sender_id: senderId,
			receiver_id: receiverId,
			type: 'sent', // 发送方
			content: messageText,
			content_type: 1, // 1: 文本消息
			date: new Date(),
			send_state: 'sending',
			is_read: true
		}
		// 消息持久化
		const messagesId = await WebDB.messages.add(message)
		// 恢复输入框状态
		setMessageText('')
		setTimeout(() => {
			messagebarRef.current.f7Messagebar().focus()
		})
		// 发送消息
		const messageFilter = _.mapKeys(_.pick(message, ['content', 'receiver_id', 'content_type']), (value, key) => {
			if (key === 'content_type') return 'type'
			return key
		})
		console.error('TODO: 后端限制类型，一定要数值类型')
		sendToUser({
			...messageFilter,
			dialog_id: parseInt(dialogId) // 后端限制类型，一定要数值类型
		})
			.then(({ code }) => {
				WebDB.messages.update(messagesId, {
					send_state: code === 200 ? 'ok' : 'error'
				})
			})
			.catch((err) => {
				console.log(err)
				WebDB.messages.update(messagesId, {
					send_state: 'error'
				})
				// TODO: 消息发送失败后提供重新发送支持
			})
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
	// End of iOS web app fix

	return (
		<Page className="messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink backLinkShowText={false}>
				<Link slot="right" iconF7="videocam" />
				<Link slot="right" iconF7="phone" />
				<Link slot="title" href={`/profile/${receiverId}/`} className="title-profile-link">
					<img src={`/avatars/${contact?.avatar}`} loading="lazy" />
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
				onInput={(e) => setMessageText(e.target.value)}
				onFocus={onMessagebarFocus}
				onBlur={onMessagebarBlur}
			>
				<Link slot="inner-start" iconF7="plus" />
				<Link className="messagebar-sticker-link" slot="after-area" iconF7="sticker" />
				{messageText.trim().length ? (
					<Link
						slot="inner-end"
						className="messagebar-send-link"
						iconF7="paperplane_fill"
						onClick={sendMessage}
					/>
				) : (
					<>
						<Link slot="inner-end" href="/camera/" iconF7="camera" />
						<Link slot="inner-end" iconF7="mic" />
					</>
				)}
			</Messagebar>

			<Messages ref={messagesRef}>
				{messages.map((message, index) => (
					<Message
						key={index}
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						type={message.type}
						text={message.content}
						className="message-appear-from-bottom"
					>
						<span slot="text-footer">
							{messageTime(message)}
							{message?.send_state ? (
								message.type === 'sent' && message.send_state === 'ok' ? (
									<DoubleTickIcon />
								) : (
									`[${message.send_state}]`
								)
							) : (
								''
							)}
						</span>
					</Message>
				))}
			</Messages>

			{/* <List
				medialList
				virtualList
				virtualListParams={{
					items: messages,
					renderExternal
				}}
			>
				<ul>
					{vlData.items.map((message, index) => (
						<ListItem
							key={index}
							first={isMessageFirst(message)}
							last={isMessageLast(message)}
							tail={isMessageLast(message)}
							type={message.type}
							text={message.text}
							title={message.text}
							className="message-appear-from-bottom"
							style={{ top: `${vlData.topPosition}px` }}
							virtualListIndex={messages.indexOf(message)}
						>
							<span slot="text-footer">
								{message.type === 'sent' && <DoubleTickIcon />}
								{messageTime(message)}
							</span>
						</ListItem>
					))}
				</ul>
			</List> */}
		</Page>
	)
}
