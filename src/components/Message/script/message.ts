/**
 * @description 该文件主要处理接口信息，如： 发送消息、编辑消息、撤回消息等接口逻辑
 * @author YuHong
 * @date 2024/03/20 16:13:00
 */

import MsgService from '@/api/msg'
import { MESSAGE_SEND, MessageBurnAfterRead, msgType, toastMessage, tooltipType, updateDialog } from '@/shared'
import useCacheStore from '@/stores/cache'
import useMessageStore from '@/stores/new_message'
import { generateMessage } from '@/utils/data'

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
	/** 是否先创建一条消息，默认为 true，同时会在发送成功后更新发送状态 */
	isCreateMessage?: boolean
	/** 是否保存到缓存消息中，默认为 true */
	isCreateCacheMessage?: boolean
}

/**
 * @description 发送消息
 * @param {Options} options 其他配置
 */
export const sendMessage = async ({
	content,
	msg_type,
	isCreateMessage = true,
	isCreateCacheMessage = true,
	...options
}: Options) => {
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
	const message = generateMessage({
		content: content,
		msg_send_state: MESSAGE_SEND.SENDING,
		msg_type,
		reply_id: isReply ? messageStore.selectedMessage?.msg_id : 0,
		dialog_id: dialogId,
		is_burn_after_reading: isBurnAfterReading
	})

	// 是否预先创建一条消息
	if (isCreateMessage) {
		await cacheStore.addCacheMessage(message)
		await messageStore.createMessage(message)
	}

	// 基本参数
	const params: any = {
		type: message.msg_type,
		content: message.content,
		dialog_id: dialogId,
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

	// 发送消息
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
		// 生成错误信息并添加至会话
		const errorMessage = generateMessage({ content: error?.message, msg_type: msgType.ERROR })
		await message.createMessage(errorMessage)
		await cacheStore.addCacheMessage(errorMessage)
	} finally {
		console.log('message.msg_send_state', message)

		if (isCreateMessage) await messageStore.updateMessage(message)
		if (isCreateCacheMessage) await cacheStore.updateCacheMessage(message)
		// 更新本地会话
		updateDialog(message)
	}

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
	try {
		for (let i = 0; i < messageStore.selectedForwardUsers.length; i++) {
			const item = messageStore.selectedForwardUsers[i]

			for (let j = 0; j < messageStore.selectedMessages.length; j++) {
				const msg = messageStore.selectedMessages[j]

				await sendMessage({
					content: msg.content,
					msg_type: msg.msg_type,
					isCreateMessage: item?.dialog_receiver_id === messageStore.receiverId,
					...item
				})
			}
		}
		toastMessage('转发成功')
	} catch (error: any) {
		toastMessage(error.message ?? '转发失败')
	} finally {
		// 清空选中的消息
		messageStore.update({ selectedMessages: [], selectedForwardUsers: [] })
	}
}
