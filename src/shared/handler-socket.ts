import { getCookie } from '@/utils/cookie'
import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, USER_ID } from '.'
import UserStore from '@/db/user'
import { v4 as uuidv4 } from 'uuid'

const user_id = getCookie(USER_ID) || ''

/**
 * 处理私聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerMessageSocket = async (data: any, updateMessage: (msg:any)=> void) => {
	try {
		console.log('data', data)

		// 如果是当前设备就不需要继续操作了
		// if (Number(getCookie(RID)) === data.rid) return

		const message = data.data

		// 如果就收到的消息是自己发的
		if (user_id === message.sender_id) return

		const msg = {
			dialog_id: message?.dialog_id,
			content: message?.content,
			create_at: message?.send_at,
			is_burn_after_reading: message?.is_burn_after_reading,
			is_label: MESSAGE_MARK.NOT_MARK,
			is_read: MESSAGE_READ.NOT_READ,
			msg_id: message?.msg_id,
			msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
			receiver: message?.sender_id || message?.group_id,
			read_at: message?.read_at || null,
			reply_id: message?.reply_id,
			sender_id: message?.sender_id,
			type: message?.type || message?.msgType,
			sender_info: message?.sender_info,
			at_all_user: message?.at_all_user || [],
			at_users: message?.at_users || [],
			group_id: message?.group_id,
			uid: uuidv4(),
			is_tips: false
		}

		updateMessage(msg)
		await UserStore.add(UserStore.tables.messages, msg)
	} catch (error) {
		console.log('处理失败')
	}
}

/**
 * 处理好友获取群聊请求接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerRequestSocket = (data: any) => {
	try {
		console.log('处理好友请求', data)
	} catch (error) {
		console.log('处理失败')
	}
}

export const handlerMessage = (msg: any) => {
	return {
		dialog_id: msg?.dialog_id,
		content: msg?.content,
		create_at: msg?.send_at,
		is_burn_after_reading: msg?.is_burn_after_reading,
		is_label: MESSAGE_MARK.NOT_MARK,
		is_read: MESSAGE_READ.NOT_READ,
		msg_id: msg?.msg_id,
		msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
		receiver: msg?.sender_id || msg?.group_id,
		read_at: msg?.read_at,
		reply_id: msg?.reply_id,
		sender_id: msg?.sender_id,
		type: msg?.type || msg?.msgType,
		sender_info: msg?.sender_info,
		at_all_user: msg?.at_all_user || [],
		at_users: msg?.at_users || [],
		group_id: msg?.group_id
	}
}
