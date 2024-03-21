/**
 * @description 该文件主要处理接口信息，如： 发送消息、编辑消息、撤回消息等接口逻辑
 * @author YuHong
 * @date 2024/03/20 16:13:00
 */

import MsgService from '@/api/msg'
import {  MESSAGE_SEND, msgType } from '@/shared'
import useMessageStore from '@/stores/new_message'
// import useUserStore from '@/stores/user'
import { generateMessage } from '@/utils/data'

/**
 * @description 发送消息
 * @param {string} content 消息内容
 * @param {msgType} type 消息类型
 */
export const sendMessage = async (content: string, type: msgType) => {
	const messageStore = useMessageStore.getState()

	// 生成消息对象
	const message = generateMessage({
		content,
		msg_send_state: MESSAGE_SEND.SENDING,
		type
	})

	messageStore.updateMessage(message)

	const params: any = {
		type: message.type,
		content: message.content,
		dialog_id: message.dialog_id,
		replay_id: message.reply_id,
		is_burn_after_reading: message.is_burn_after_reading
	}

	// 对群聊或私聊消息进行区分
	if (messageStore.isGroup) {
		// params['at_all_user'] = at_all_user || 0
		// params['at_users'] = at_users || []
		params['group_id'] = message.group_id
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
		const errorMessage = generateMessage({ content: error?.message, type: msgType.ERROR })
		messageStore.updateMessage(errorMessage)
	} finally {
		messageStore.updateMessage(message, false)
	}
}
