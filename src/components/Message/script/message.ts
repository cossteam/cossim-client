/**
 * @description 该文件主要处理接口信息，如： 发送消息、编辑消息、撤回消息等接口逻辑
 * @author YuHong
 * @date 2024/03/20 16:13:00
 */

import MsgService from '@/api/msg'
import { MESSAGE_SEND, msgType, toastMessage, tooltipType } from '@/shared'
import useMessageStore from '@/stores/new_message'
// import useUserStore from '@/stores/user'
import { generateMessage } from '@/utils/data'

interface Options {
	dialog_id?: number
	dialog_receiver_id?: string | number
	isGroup?: boolean
	content: string
	msg_type: msgType
	isUpdate?: boolean
}

/**
 * @description 发送消息
 * @param {Options} options 其他配置
 */
export const sendMessage = async ({ content, msg_type, isUpdate = true, ...options }: Options) => {
	const messageStore = useMessageStore.getState()

	// 是否是回复消息
	const isReply = messageStore.manualTipType === tooltipType.REPLY
	// 会话 id
	const dialogId = options?.dialog_id ?? messageStore.dialogId

	// 生成消息对象
	const message = generateMessage({
		content: content,
		msg_send_state: MESSAGE_SEND.SENDING,
		msg_type,
		reply_id: isReply ? messageStore.selectedMessage?.msg_id : 0,
		dialog_id: dialogId
	})

	// 如果不需要在发送前创建一条消息，就把 isUpdate 设置为 false
	isUpdate && (await messageStore.createMessage(message))

	const params: any = {
		type: message.msg_type,
		content: message.content,
		dialog_id: dialogId,
		reply_id: message.reply_id,
		is_burn_after_reading: message.is_burn_after_reading
	}

	// 对群聊或私聊消息进行区分
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
		await messageStore.updateMessage(errorMessage, dialogId, true)
	} finally {
		await messageStore.updateMessage(message, dialogId, isUpdate ? false : true)
	}

	return message
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

		messageStore.updateMessage({ ...message, content }, message?.dialog_id, false)
	} catch (error: any) {
		toastMessage(error?.message ?? '编辑失败')
		messageStore.updateMessage(message, message?.dialog_id, false)
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
					isUpdate: item?.dialog_receiver_id === messageStore.receiverId,
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
