/**
 * @description 该文件主要处理接口信息，如： 发送消息、编辑消息、撤回消息等接口逻辑
 * @author YuHong
 * @date 2024/03/20 16:13:00
 */

import MsgService from '@/api/msg'
import { MESSAGE_SEND, msgType, toastMessage, tooltipType } from '@/shared'
import useCacheStore from '@/stores/cache'
import useMessageStore from '@/stores/new_message'
// import useUserStore from '@/stores/user'
import { generateMessage } from '@/utils/data'

/**
 * @description 发送消息
 * @param {string} content 消息内容
 * @param {msgType} type 消息类型
 * @param {Options} options 其他配置
 */
export const sendMessage = async (content: string, type: msgType) => {
	const messageStore = useMessageStore.getState()

	// 是否是回复消息
	const isReply = messageStore.manualTipType === tooltipType.REPLY

	// 生成消息对象
	const message = generateMessage({
		content,
		msg_send_state: MESSAGE_SEND.SENDING,
		msg_type: type,
		reply_id: isReply ? messageStore.selectedMessage?.msg_id : 0
	})

	// 是否当前会话
	// const dialogId = options?.dialogId ?? messageStore.dialogId
	// const isCurrentDialog = dialogId === messageStore.dialogId

	// 只有处于当前会话需要当前会话
	await messageStore.updateMessage(message)

	const params: any = {
		type: message.msg_type,
		content: message.content,
		dialog_id: message.dialog_id,
		reply_id: message.reply_id,
		is_burn_after_reading: message.is_burn_after_reading
	}

	// 对群聊或私聊消息进行区分
	if (messageStore.isGroup) {
		params['at_all_user'] = messageStore.atAllUser
		params['at_users'] = messageStore.atUsers
		params['group_id'] = message.receiver_id
	} else {
		params['receiver_id'] = message.receiver_id
	}

	try {
		const { code, data, msg } = messageStore.isGroup
			? await MsgService.sendGroupMessageApi(params)
			: await MsgService.sendUserMessageApi(params)

		if (code !== 200) {
			message.msg_send_state = MESSAGE_SEND.SEND_FAILED
			throw new Error(msg)
		}
		message.msg_send_state = MESSAGE_SEND.SEND_SUCCESS
		message.msg_id = data.msg_id
	} catch (error: any) {
		message.msg_send_state = MESSAGE_SEND.SEND_FAILED
		const errorMessage = generateMessage({ content: error?.message, msg_type: msgType.ERROR })
		// isCurrentDialog
		await messageStore.updateMessage(errorMessage)
		// : await cacheStore.addCacheMessage(errorMessage)
	} finally {
		await messageStore.updateMessage(message, false)
		//  : await cacheStore.addCacheMessage(message)
	}
}

/**
 * 修改消息
 * @param {string}	content 消息内容
 *
 */
export const editMessage = async (content: string) => {
	const messageStore = useMessageStore.getState()
	const message = messageStore.selectedMessage
	if (!message) return
	try {
		const params = {
			msg_type: message?.msg_type,
			content,
			msg_id: message?.msg_id
		}
		const { code, msg } = messageStore.isGroup
			? await MsgService.editGroupMessageApi(params)
			: await MsgService.editUserMessageApi(params)

		if (code !== 200) throw new Error(msg)

		messageStore.updateMessage({ ...message, content }, false)
	} catch (error: any) {
		toastMessage(error?.message ?? '编辑失败')
	}
}

interface Options {
	/** 回复 id */
	replyId?: number
	/** 是否是群聊 */
	isGroup?: boolean
	/** 接收者 id， 如果是群就是群 id */
	receiverId: string
	/** 会话 id */
	dialogId?: number
	/** 是否 at 全体成员 */
	atAllUser?: number
	/** at 的成员 id */
	atUsers?: string[]
	/** 是否阅后即焚 */
	isBurnAfterReading?: number
	/** 消息类型 */
	msgType: msgType
	/** 消息内容 */
	content: string
}

/**
 * 转发消息
 *
 * @param {Options} options  转发消息配置
 */
export const forwardMessage = async (options: Options) => {
	const cacheStore = useCacheStore.getState()
	const messageStore = useMessageStore.getState()

	// 生成消息对象
	const message = generateMessage({
		content: options.content,
		msg_send_state: MESSAGE_SEND.SENDING,
		msg_type: options.msgType
	})

	// 只有处于当前会话需要当前会话
	await messageStore.updateMessage(message)

	const dialogId = options.dialogId ?? messageStore.dialogId
	const isCurrentDialog = dialogId === messageStore.dialogId

	try {
		const params: any = {
			type: options.msgType,
			content: options.content,
			dialog_id: options.dialogId,
			replay_id: options?.replyId ?? 0,
			is_burn_after_reading: options.isBurnAfterReading ?? 0
		}

		// 对群聊或私聊消息进行区分
		if (messageStore.isGroup) {
			params['at_all_user'] = messageStore.atAllUser
			params['at_users'] = messageStore.atUsers
			params['group_id'] = options.receiverId
		} else {
			params['receiver_id'] = options.receiverId
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
	} catch (error: any) {
		message.msg_send_state = MESSAGE_SEND.SEND_FAILED
		const errorMessage = generateMessage({ content: error?.message, msg_type: msgType.ERROR })
		isCurrentDialog
			? await messageStore.updateMessage(errorMessage)
			: await cacheStore.addCacheMessage(errorMessage)
	} finally {
		isCurrentDialog ? await messageStore.updateMessage(message, false) : await cacheStore.addCacheMessage(message)
	}
}
