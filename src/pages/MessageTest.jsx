import $ from 'dom7'
import React, { useRef, useState } from 'react'
import {
	f7,
	Navbar,
	Link,
	Page,
	/*List, ListItem,*/ Messages,
	Message,
	Messagebar,
	MessagebarSheet,
	MessagebarSheetImage,
	MessagebarAttachments,
	MessagebarAttachment,
	Icon
} from 'framework7-react'
import './Messages/Messages.less'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { getMsgByUser, sendToUser } from '@/api/msg'
import { useEffect } from 'react'
import _ from 'lodash-es'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useUserStore } from '@/stores/user'
import { emojis } from './Messages/emojis/emojis'

import { SessionBuilder, SessionCipher, SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
import { createSession, encryptMessage } from '@/utils/protocol'
import { SignalDirectory } from '@/utils/signal-directory'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	console.log('MessagesPage-TEST')

	const { user, identity } = useUserStore()
	const senderId = user?.UserId
	const receiverId = f7route.params.id // 好友id/群聊id
	const dialogId = f7route.query.dialog_id
	console.log('接收人', receiverId)

	// 图片表情
	const emojisImg = [
		'https://cdn.framework7.io/placeholder/cats-300x300-1.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-2.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-3.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-4.jpg',
		'https://cdn.framework7.io/placeholder/cats-150x300-5.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-6.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x300-7.jpg',
		'https://cdn.framework7.io/placeholder/cats-200x300-8.jpg',
		'https://cdn.framework7.io/placeholder/cats-400x300-9.jpg',
		'https://cdn.framework7.io/placeholder/cats-300x150-10.jpg'
	]
	const [attachments, setAttachments] = useState([])
	const [sheetVisible, setSheetVisible] = useState(false)
	const [showImgEmojis, setShowImgEmojis] = useState(false)
	const IconComponent = (props) => (
		<span onClick={() => setShowImgEmojis(!showImgEmojis)}>
			<Icon f7={props.fill ? 'smiley_fill' : 'smiley'} color="primary" />
		</span>
	)
	IconComponent.propTypes = {
		fill: PropType.bool
	}
	const deleteAttachment = (image) => {
		const index = attachments.indexOf(image)
		attachments.splice(index, 1)
		setAttachments([...attachments])
	}
	const attachmentsVisible = () => {
		return attachments.length > 0
	}
	const placeholder = () => {
		return attachments.length > 0 ? 'Add comment or Send' : 'Message'
	}
	const handleAttachment = (e) => {
		const index = f7.$(e.target).parents('label.checkbox').index()
		const image = emojisImg[index]
		if (e.target.checked) {
			// Add to attachments
			attachments.unshift(image)
		} else {
			// Remove from attachments
			attachments.splice(attachments.indexOf(image), 1)
		}
		setAttachments([...attachments])
	}
	const addEmojis = (emoji) => {
		setMessageText(messageText + emoji)
		// messagebarRef.current.f7Messagebar().focus()
		// setSheetVisible(!sheetVisible)
	}

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
				oldItem ? await WebDB.messages.update(oldItem.id, item) : await WebDB.messages.add(item)
			}
		} catch (error) {
			console.log(error)
		}
	}

	// 初始化后执行
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

	const isJSONString = (jsonString) => {
		if (jsonString[0] === '{' && jsonString[jsonString.length - 1] === '}') return true
		return false
	}

	// 发送消息
	const messagebarRef = useRef(null)
	const [messageText, setMessageText] = useState('')

	// 生成对方地址
	// TODO： 这些信息从 indexDB 拿获取从后端拿
	const address = new SignalProtocolAddress('test2', 2)

	// const directory = new SignalDirectory()
	const sessionCipher = new SessionCipher(identity.store, address)
	// directory._data = identity.directory._data
	// console.log("directory",directory);

	// TODO: 这个后续由后端推或者本地拿
	const bundle = {
		identityKey: 'BW4hk6tGBRRFmSCgDdYM8cu9ZMOf+1Au9bSPDDn2j9wB',
		signedPreKey: {
			keyId: 7497,
			publicKey: 'BaWVGemCIAApt+j8avKEw5g4/rJbawVCEIA247jc0S9O',
			signature: 'dAmrdLLzwBinJU7KTuxDaBLGoALPEvCS35w4Z6Tjusd8pTuydsZbddkqLUUjfhJf22nqYN51+ILNwPhAM3F9gQ=='
		},
		preKey: {
			keyId: 5639,
			publicKey: 'BX1H7iXUcv82Yd8bp7PE8slj+/X6jMax8Mu3AIgBEFUj'
		},
		registrationId: 3964
	}

	// 将字符串变成 ArrayBuffer
	function stringToArrayBuffer(base64String) {
		// 使用atob将Base64字符串转换为二进制字符串
		const binaryString = atob(base64String)

		// 创建一个Uint8Array视图
		const uint8Array = new Uint8Array(binaryString.length)

		// 将二进制字符串的每个字符转换为Uint8Array的元素
		for (let i = 0; i < binaryString.length; i++) {
			uint8Array[i] = binaryString.charCodeAt(i)
		}

		// 现在，uint8Array是包含解码后数据的Uint8Array
		const buffer = uint8Array.buffer

		return buffer
	}

	for (const key in bundle) {
		// obj[key] = bundle[key]
		if (typeof bundle[key] === 'object') {
			for (const k in bundle[key]) {
				// 如果是 ArrayBuffer
				if (typeof bundle[key][k] === 'string') {
					// 把 ArrayBuffer 转成字符串
					bundle[key][k] = stringToArrayBuffer(bundle[key][k])
				}
			}
		}

		if (typeof bundle[key] === 'string') {
			// 把 ArrayBuffer 转成字符串
			bundle[key] = stringToArrayBuffer(bundle[key])
		}
	}

	console.log('stringToArrayBuffer', bundle)

	createSession(identity.store, address, bundle)

	//! 发送
	// TODO：在此之前要有对方的一些基本信息， 如果对方没有，就先发送一个请求获取对方的基本信息
	const sendMessage = async () => {
		const ciphertext = await encryptMessage(messageText, sessionCipher)
		console.log('ciphertext', ciphertext)

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
		setAttachments([])
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
			content: JSON.stringify({
				attachments,
				text: messageFilter.content
			}),
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
				placeholder={placeholder()}
				value={messageText}
				sheetVisible={sheetVisible}
				attachmentsVisible={attachmentsVisible()}
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
				{messageText.trim().length || attachments.length > 0 ? (
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
				{/* 表情、图片选择 */}
				<MessagebarAttachments>
					{attachments.map((image, index) => (
						<MessagebarAttachment
							key={index}
							image={image}
							onAttachmentDelete={() => deleteAttachment(image)}
						/>
					))}
				</MessagebarAttachments>
				<MessagebarSheet>
					<div onClick={(e) => e.stopPropagation()}>
						<div className="m-1 p-1">{showImgEmojis ? <IconComponent /> : <IconComponent fill />}</div>
						{!showImgEmojis ? (
							// emojis
							<div className="pl-3.5" onClick={(e) => e.stopPropagation()}>
								{emojis.map((emoji, eKey) => (
									<span key={eKey} className="m-1 p-1 text-2xl" onClick={() => addEmojis(emoji)}>
										{emoji}
									</span>
								))}
							</div>
						) : (
							// 图片表情
							<div className="p-1">
								{emojisImg.map((image, index) => (
									<MessagebarSheetImage
										key={index}
										image={image}
										checked={attachments.indexOf(image) >= 0}
										onChange={handleAttachment}
									/>
								))}
							</div>
						)}
					</div>
				</MessagebarSheet>
			</Messagebar>

			<Messages ref={messagesRef}>
				{messages.map((message, index) => (
					<Message
						key={index}
						className="message-appear-from-bottom"
						data-key={index}
						first={isMessageFirst(message)}
						last={isMessageLast(message)}
						tail={isMessageLast(message)}
						// image={['https://cdn.framework7.io/placeholder/cats-300x300-1.jpg']}
						type={messageType(message)}
						text={isJSONString(message.content) ? JSON.parse(message.content).text : message.content}
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
