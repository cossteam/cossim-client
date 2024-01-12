import $ from 'dom7'
import React, { useRef, useState } from 'react'
import { f7, Navbar, Link, Page, /*List, ListItem,*/ Messages, Message, Messagebar } from 'framework7-react'
import './Messages.less'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { getMsgByUser, sendToUser } from '@/api/msg'
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
	console.log('接收人', receiverId)

	// 联系人
	const [contact, setContact] = useState({})
	useEffect(() => {
		if (!receiverId) return
		;async () => {
			const contact = await WebDB.contacts.where('user_id').equals(receiverId).first()
			setContact(contact || {})
		}
	}, [receiverId])

	// 获取消息
	let pageNum = 1
	let pageSize = 18
	let total = 0
	// 倒序分页查询
	async function reversePageQuery(pageSize, pageIndex) {
		// 计算起始位置
		const offset = (pageIndex - 1) * pageSize
		// 执行倒序查询
		console.log(pageSize, pageNum)
		const arr = await WebDB.messages
			.orderBy('id')
			// .reverse() // 倒序
			.offset(offset)
			.limit(pageSize)
			.toArray()
		console.log(arr)
		arr && (pageNum += 1)
		return arr
	}
	// const messages = useLiveQuery(() => reversePageQuery(pageSize, pageNum)) || []
	const messages = useLiveQuery(() => WebDB.messages.toArray()) || []
	// 获取服务端消息数据
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
					if (total / pageSize > pageNum) {
						pageNum += 1
					}
					resolve(data)
				})
				.catch((err) => {
					reject(err)
				})
		})
	}
	// 更新本地消息
	const refreshMessage = async () => {
		try {
			const { user_messages } = await getMessage()
			const respData = user_messages?.map((msg) => {
				// id, sender_id, receiver_id, content, type, replay_id, is_read, read_at, created_at, dialog_id
				// ||
				// id, sender_id, receiver_id, content, type, replay_id, is_read, read_at, created_at, dialog_id, send_state
				return {
					...msg,
					send_state: 'ok' // 'sending' => 'ok' or 'err'
				}
			})
			console.log(respData)
			const oldData = (await WebDB.messages.toArray()) || []
			// 校验新数据和旧数据 => 更新数据 or 插入数据库
			for (let i = 0; i < respData.length; i++) {
				const item = respData[i]
				const oldItem = oldData.find((oldItem) => oldItem.id === item.id)
				oldItem ? await WebDB.messages.update(oldItem.id, item) : await WebDB.messages.put(item)
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		refreshMessage()
		const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
		// 滚动到顶部加载更多
		messagesContent?.addEventListener(
			'scroll',
			_.throttle(async () => {
				if (messagesContent.scrollTop === 0) {
					console.log('触顶')
					// await refreshMessage()
					reversePageQuery(pageSize, pageNum)
				}
			}, 1000)
		)

		return () => {
			messagesContent?.removeEventListener('scroll', () => {})
		}
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
		return message.receiver_id === receiverId ? 'sent' : 'received'
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
						type={messageType(message)}
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
