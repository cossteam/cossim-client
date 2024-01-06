import $ from 'dom7'
import React, { useRef, useState } from 'react'
import { f7, Navbar, Link, Page, /*List, ListItem,*/ Messages, Message, Messagebar } from 'framework7-react'
import './Messages.less'
import { useChatsStore } from '@/stores/chats'
import { useContactsStore } from '@/stores/contacts'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { sendToUser } from '@/api/message'
import { useEffect } from 'react'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	const { contacts } = useContactsStore() // 全部联系人
	const { chats, updateChats } = useChatsStore() // 全部聊天记录
	const userId = f7route.params.id // 好友id/群聊id
	const contact = contacts.filter((contact) => contact.id === userId)[0] // 好友信息/群聊信息
	const messagesData = chats.filter((chat) => chat.userId === userId)[0] || {
		messages: []
	} // 聊天记录

	const messagebarRef = useRef(null)
	const [messages, setMessages] = useState([...messagesData.messages])
	// 虚拟列表
	const messagesRef = useRef(null)
	// const [vlData, setVlData] = useState({
	// 	items: []
	// })
	// const renderExternal = (vl, newData) => {
	// 	console.table(newData.items)
	// 	setVlData({ ...newData })
	// }
	const [messageText, setMessageText] = useState('')
	useEffect(() => {
		// WebSocketClient.addListener('onMessage', (msg) => {
		// 	console.log('收到消息', msg)
		// })
		const messagesContent = document.getElementsByClassName('page-content messages-content')[0]
		// console.log(messagesContent)
		messagesContent?.addEventListener('scroll', () => {
			if (messagesContent.scrollTop === 0) {
				console.log('已滚动到顶部')
			}
		})
		// console.log(messagesRef)
		// const listDOM = messagesRef.current.f7Messages().el
		// console.log(listDOM)
		// listDOM.addEventListener('scroll', () => {
		// 	console.log(listDOM.scrollTop)
		// 	if (listDOM.scrollTop === 0) {
		// 		console.log('已滚动到顶部')
		// 	}
		// })
	}, [])

	const messageTime = (message) =>
		Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(message.date))
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

	const sendMessage = () => {
		const message = {
			text: messageText,
			date: new Date(),
			type: 'sent',
			state: 'sending'
		}
		messagesData.messages.push(message)
		setMessageText('')
		setMessages([...messagesData.messages])
		updateChats(chats)
		setTimeout(() => {
			messagebarRef.current.f7Messagebar().focus()
		})
		sendToUser({
			content: messageText,
			receiver_id: userId,
			// replay_id: ,
			type: 1
		})
			.then(({ code }) => {
				if (code === 200) {
					message.state = 'ok'
				} else {
					message.state = 'error'
				}
			})
			.catch((err) => {
				console.log(err)
				message.state = 'error'
				// TODO: 消息发送失败后提供重新发送支持
			})
			.finally(() => {
				setMessages([...messagesData.messages])
			})
	}

	// 订阅状态变化
	// 在组件卸载时取消订阅，以避免潜在的内存泄漏
	useEffect(
		() =>
			useChatsStore.subscribe(
				({ chats }) => {
					// console.log('数据发生变化：', chats)
					// 在这里执行你的逻辑，例如更新组件的状态
					const chat = chats.filter((chat) => chat.userId === userId)[0] || {
						messages: []
					}
					setMessages([...chat.messages])
				},
				(state) => state.chats // 监听的状态属性，可以是单一属性或整个状态对象
			),
		[]
	)

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
				<Link slot="title" href={`/profile/${userId}/`} className="title-profile-link">
					<img src={`/avatars/${contact.avatar}`} loading="lazy" />
					<div>
						<div>{contact.name}</div>
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
						text={message.text}
						className="message-appear-from-bottom"
					>
						<span slot="text-footer">
							{messageTime(message)}
							{message?.state ? (
								message.type === 'sent' && message.state === 'ok' ? (
									<DoubleTickIcon />
								) : (
									`[${message.state}]`
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
