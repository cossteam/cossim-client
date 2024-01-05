import $ from 'dom7'
import React, { useRef, useState } from 'react'
import { f7, Navbar, Link, Page, List, ListItem, Messages, Message, Messagebar } from 'framework7-react'
import './Messages.less'
import { useChatsStore } from '@/stores/chats'
import { useContactsStore } from '@/stores/contacts'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { senToUser } from '@/api/message'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	const { contacts } = useContactsStore()
	const { chats, updateChats } = useChatsStore()
	// const userId = parseInt(f7route.params.id, 10)
	const userId = '69f316b1-e992-43ab-8cc9-a14093cca5e0'
	const messagesData = chats.filter((chat) => chat.userId === userId)[0] || {
		messages: []
	}
	const contact = contacts.filter((contact) => contact.id === userId)[0]

	const messagebarRef = useRef(null)
	const [messages, setMessages] = useState([...messagesData.messages])
	// 虚拟列表
	const messagesRef = useRef(null)
	const [vlData, setVlData] = useState({
		items: []
	})
	const renderExternal = (vl, newData) => {
		console.table(newData.items)
		setVlData({ ...newData })
	}
	const [messageText, setMessageText] = useState('')
	// console.log(messagesRef.current.f7Messages())

	const messageTime = (message) =>
		Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(message.date)
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
		let isErr = false
		senToUser({
			content: messageText,
			receiver_id: '69f316b1-e992-43ab-8cc9-a14093cca5e0' || userId, // 临时调式
			// replay_id: ,
			type: 1
		})
			.then(({ code }) => {
				if (code === 200) {
					isErr = false
				} else {
					isErr = true
				}
			})
			.catch((err) => {
				console.log(err)
				isErr = true
			})
			.finally(() => {
				messagesData.messages.push({
					text: `${messageText}${isErr ? '[未发送]' : ''}`,
					date: new Date(),
					type: 'sent'
				})
				setMessageText('')
				console.log(messagesData.messages)
				setMessages([...messagesData.messages])
				console.log(chats)
				updateChats(chats)
				setTimeout(() => {
					messagebarRef.current.f7Messagebar().focus()
				})
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
							{message.type === 'sent' && <DoubleTickIcon />}
							{messageTime(message)}
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
