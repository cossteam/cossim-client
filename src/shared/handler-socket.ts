import { getCookie } from '@/utils/cookie'
import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MESSAGE_TYPE, USER_ID } from '.'
import UserStore from '@/db/user'
import { v4 as uuidv4 } from 'uuid'
import { MessageStore } from '@/stores/message'

const user_id = getCookie(USER_ID) || ''

/**
 * 处理私聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerMessageSocket = async (data: any, updateMessage: (msg: any) => void) => {
	try {
		console.log('data', data)

		// 如果是当前设备就不需要继续操作了
		// if (Number(getCookie(RID)) === data.rid) return

		const message = data.data

		//  TODO: 后续还要判断是否同一设备 id
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
		console.log('处理好友请求失败')
	}
}

/**
 * 处理标注消息
 * @param {*} data  socket 消息
 * @returns
 */
export const handlerLabelSocket = async (data: any, msgStore: MessageStore) => {
	try {
		//  TODO: 后续还要判断是否同一设备 id
		if (user_id === data.uid) return

		const msg = data.data
		const doc = new DOMParser().parseFromString(msg?.content, 'text/html')
		const txt = doc.body.textContent

		const uid = msgStore.messages.find((m: any) => m.msg_id === msg.msg_id)?.uid

		const marks = {
			tips_msg_id: msg.msg_id,
			content: txt,
			dialog_id: msg.dialog_id,
			pid: uid,
			uid: uuidv4(),
			is_label: msg?.is_label,
			sender_info: msg.sender_info,
			sender_id: msg.sender_id,
			type: MESSAGE_TYPE.LABEL,
			label_id: data.uid
		}

		await UserStore.add(UserStore.tables.messages, marks)
		msgStore.updateMessage(marks)

		return marks
	} catch (error) {
		console.log('处理标注失败')
	}
}
