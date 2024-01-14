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
import './Messages.less'
import DoubleTickIcon from '@/components/DoubleTickIcon'
import PropType from 'prop-types'
import { getMsgByUser, sendToUser } from '@/api/msg'
import { useEffect } from 'react'
import _ from 'lodash-es'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useUserStore } from '@/stores/user'
import { emojis, emojisImg } from './emojis/emojis'

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired
}

export default function MessagesPage({ f7route }) {
	const { user } = useUserStore()
	const senderId = user?.UserId
	const receiverId = f7route.params.id // 好友id/群聊id
	const dialogId = f7route.query.dialog_id
	console.log('接收人', receiverId)

	// 图片表情
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
	// async function reversePageQuery(pageSize, pageIndex) {
	// 	// 计算起始位置
	// 	const offset = (pageIndex - 1) * pageSize
	// 	// 执行倒序查询
	// 	console.log(pageSize, pageNum)
	// 	const arr = await WebDB.messages
	// 		.orderBy('id')
	// 		// .reverse() // 倒序
	// 		.offset(offset)
	// 		.limit(pageSize)
	// 		.toArray()
	// 	console.log(arr)
	// 	arr && (pageNum += 1)
	// 	return arr
	// }
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
					await refreshMessage()
					// reversePageQuery(pageSize, pageNum)
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
	// const isJSONString = (jsonString) => {
	// 	if (jsonString[0] === '{' && jsonString[jsonString.length - 1] === '}') return true
	// 	return false
	// }

	// 发送消息
	const messagebarRef = useRef(null)
	const [messageText, setMessageText] = useState('')
	const sendMessage = async () => {
		const allMsg = []
		// 选择多个图片表情时拆分为多条消息发送
		attachments.map((item) => {
			allMsg.push({
				sender_id: senderId,
				receiver_id: receiverId,
				type: 'sent', // 发送方
				content: item,
				content_type: 3, // 3: 图片消息
				date: new Date(),
				send_state: 'sending',
				is_read: true
			})
		})
		messageText &&
			allMsg.push({
				sender_id: senderId,
				receiver_id: receiverId,
				type: 'sent', // 发送方
				content: messageText,
				content_type: 1, // 1: 文本消息
				date: new Date(),
				send_state: 'sending',
				is_read: true
			})
		// 消息持久化
		const allMsgIds = await Promise.all(allMsg.map(async (item) => WebDB.messages.add(item)))
		console.log(allMsg)
		console.log(allMsgIds)
		// 恢复输入框状态
		setMessageText('')
		setAttachments([])
		setTimeout(() => {
			messagebarRef.current.f7Messagebar().focus()
		})
		// 发送消息前格式化数据
		const reqMsg = allMsg.map((item) => {
			const messageFilter = _.mapKeys(_.pick(item, ['content', 'receiver_id', 'content_type']), (value, key) => {
				if (key === 'content_type') return 'type'
				return key
			})
			return {
				...messageFilter,
				dialog_id: parseInt(dialogId) // 后端限制类型，一定要数值类型
			}
		})
		console.log(reqMsg)
		try {
			const respMsgs = await Promise.all(
				reqMsg.map(async (item, index) => {
					return new Promise((resolve, reject) => {
						sendToUser(item)
							.then(({ code }) => {
								WebDB.messages.update(allMsgIds[index], {
									send_state: code === 200 ? 'ok' : 'error'
								})
								code === 200 ? resolve(allMsgIds[index]) : reject(allMsgIds[index])
							})
							.catch(() => {
								WebDB.messages.update(allMsgIds[index], {
									send_state: 'error'
								})
								// TODO: 消息发送失败后提供重新发送支持
								reject(allMsgIds[index])
							})
					})
				})
			)
			console.log(respMsgs)
		} catch (errors) {
			console.log(errors)
		}
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
