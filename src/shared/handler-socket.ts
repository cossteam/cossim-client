import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND } from '.'

/**
 * 处理私聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerUserMessageSocket = (data: any) => {
	try {
		console.log('处理私聊', data)
	} catch (error) {
		console.log('处理失败')
	}
}

/**
 * 处理群聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerGroupMessageSocket = (data: any) => {
	try {
		console.log('处理群聊', data)
		const msg = handlerMessage(data.data)
		console.log('msg', msg)
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
		replay_id: msg?.replay_id,
		sender_id: msg?.sender_id,
		type: msg?.type,
		sender_info: msg?.sender?.info,
		at_all_user: msg?.at_all_user || [],
		at_users: msg?.at_users || [],
		group_id: msg?.group_id
	}
}
