/**
 * @description 该文件主要处理接口信息，如： 发送消息、编辑消息、撤回消息等接口逻辑
 * @author YuHong
 * @date 2024/03/20 16:13:00
 */
import MsgService from '@/api/msg'
import { MESSAGE_SEND, MessageBurnAfterRead, encrypt, msgType, toastMessage, tooltipType, updateDialog } from '@/shared'
import useCacheStore from '@/stores/cache'
import useMessageStore from '@/stores/message'
import { generateMessage } from '@/utils/data'

/**
 * @description 发送消息
 */
export const send = async (message: Message, options?: Options): Promise<Message> => {
	// 消息仓库
	const messageStore = useMessageStore.getState()

	// 加密
	const encryptMessage = messageStore.isGroup
		? message.content
		: await encrypt(messageStore.receiverId as string, message.content)

	// 基本参数
	const params: any = {
		type: message.msg_type,
		content: encryptMessage,
		dialog_id: message.dialog_id,
		reply_id: message.reply_id,
		is_burn_after_reading: message.is_burn_after_reading
	}

	// 对群聊或私聊消息参数进行区分
	if (options?.isGroup || messageStore.isGroup) {
		params['at_all_user'] = messageStore.atAllUser
		params['at_users'] = messageStore.atUsers
		params['group_id'] = options?.dialog_receiver_id ?? message.receiver_id
	} else {
		params['receiver_id'] = options?.dialog_receiver_id ?? message.receiver_id
	}

	const { code, data, msg } = messageStore.isGroup
		? await MsgService.sendGroupMessageApi(params)
		: await MsgService.sendUserMessageApi(params)

	if (code !== 200) {
		message.msg_send_state = MESSAGE_SEND.SEND_FAILED
		throw new Error(msg)
	}
	message.msg_send_state = MESSAGE_SEND.SEND_SUCCESS
	message.msg_id = data.msg_id

	return message
}

interface Options {
	/** 会话 id */
	dialog_id?: number
	/** 接收者 id，如果是群就是群 id */
	dialog_receiver_id?: string | number
	/** 收否是群聊 */
	isGroup?: boolean
	/** 内容 */
	content: string
	/** 消息类型 */
	msg_type: msgType
	/** 如果传有 uid，就会在发送成功后自动更新该 uid 对应的消息 */
	uid?: string
	/** 是否是转发 */
	isForward?: boolean
}

/**
 * @description 发送消息
 * @param {Options} options 其他配置
 */
export const sendMessage = async (options: Options) => {
	// 解析参数
	const { content, msg_type, uid } = options
	// 消息仓库
	const messageStore = useMessageStore.getState()
	// 缓存仓库
	const cacheStore = useCacheStore.getState()
	// 是否是回复消息
	const isReply = messageStore.manualTipType === tooltipType.REPLY
	// 会话 id
	const dialogId = options?.dialog_id ?? messageStore.dialogId

	// 获取是否阅后即焚
	const isBurnAfterReading =
		cacheStore.cacheContacts.find((item) => item.dialog_id === dialogId)?.preferences?.open_burn_after_reading ??
		MessageBurnAfterRead.NO

	// 生成消息对象
	let message = generateMessage({
		content: content,
		msg_send_state: MESSAGE_SEND.SENDING,
		msg_type,
		reply_id: isReply ? messageStore.selectedMessage?.msg_id : 0,
		dialog_id: dialogId,
		is_burn_after_reading: isBurnAfterReading
	})

	// 如果是回复消息
	if (isReply) message.reply_msg = messageStore.selectedMessage

	const isCreateMessage = !uid
	const isForward = !!options?.isForward

	// 如果有 uid，就把 uid 添加到消息中
	if (!isCreateMessage) message.uid = uid

	// 是否预先创建一条消息
	if (isCreateMessage) await messageStore.createMessage(message, true)

	try {
		message = await send(message, options)
	} catch (error: any) {
		message.msg_send_state = MESSAGE_SEND.SEND_FAILED
		// 生成错误信息并添加至会话
		const errorMessage = generateMessage({ content: error?.message, msg_type: msgType.ERROR })
		await messageStore.createMessage(errorMessage)
		await cacheStore.addCacheMessage(errorMessage)
	} finally {
		await messageStore.updateMessage(message)
		// 转发时需要更新缓存
		if (isForward) await cacheStore.addCacheMessage(message)
		// 更新本地会话
		updateDialog(message, dialogId)
	}

	// // 以防万一，在10秒后再次更新消息状态
	// setTimeout(() => {
	// 	if (message.msg_send_state === MESSAGE_SEND.SEND_SUCCESS) return
	// 	message.msg_send_state = MESSAGE_SEND.SEND_FAILED
	// 	messageStore.updateMessage(message)
	// }, 10000)

	return message
}

/**
 * 修改消息
 * @param {string}	content 消息内容
 */
export const editMessage = async (content: string) => {
	const messageStore = useMessageStore.getState()
	const cacheStore = useCacheStore.getState()
	const message = messageStore.selectedMessage
	if (!message) return
	try {
		const params = {
			msg_type: message?.msg_type,
			content,
			msg_id: message?.msg_id
		}

		const newMessage = { ...message, content }
		await messageStore.updateMessage(newMessage)
		await cacheStore.updateCacheMessage(newMessage)

		const { code, msg } = messageStore.isGroup
			? await MsgService.editGroupMessageApi(params)
			: await MsgService.editUserMessageApi(params)

		if (code !== 200) throw new Error(msg)
	} catch (error: any) {
		toastMessage(error?.message ?? '编辑失败')
		await messageStore.updateMessage(message)
		await cacheStore.updateCacheMessage(message)
	}
}

/**
 * 转发消息
 *
 * @param {Options} options  转发消息配置
 */
export const forwardMessage = async () => {
	const messageStore = useMessageStore.getState()
	let index = 0
	try {
		for (let i = 0; i < messageStore.selectedForwardUsers.length; i++) {
			const item = messageStore.selectedForwardUsers[i]

			for (let j = 0; j < messageStore.selectedMessages.length; j++) {
				const msg = messageStore.selectedMessages[j]

				Promise.all([forward(item, msg)])
					.then(() => {
						index++
						if (index >= messageStore.selectedMessages.length) {
							toastMessage('转发成功')
						}
					})
					.catch((error) => {
						toastMessage(error.message ?? '转发失败')
					})
			}
		}
	} catch (error: any) {
		toastMessage(error.message ?? '转发失败')
	} finally {
		// 清空选中的消息
		messageStore.update({ selectedMessages: [], selectedForwardUsers: [] })
	}
}

/**
 * 转发消息
 *
 * @param options
 */
export const forward = async (item: any, msg: Message) => {
	const messageStore = useMessageStore.getState()
	const cacheStore = useCacheStore.getState()

	let message = msg

	if (item?.dialog_receiver_id === messageStore.receiverId) {
		message = await sendMessage({
			content: msg.content,
			msg_type: msg.msg_type,
			isForward: true,
			...item
		})
	} else {
		message = { ...msg, dialog_id: item.dialog_id }
		message = await send(message, item)
		await cacheStore.addCacheMessage(message)
		updateDialog(message, message.dialog_id)
	}

	return message
}
