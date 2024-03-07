import { getCookie } from '@/utils/cookie'
import { $t, DEVICE_ID, MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MESSAGE_TYPE, USER_ID } from '.'
import UserStore from '@/db/user'
import { v4 as uuidv4 } from 'uuid'
import { MessageStore } from '@/stores/message'
// import CommonStore from '@/db/common'
import { StateStore } from '@/stores/state'

// const user_id = getCookie(USER_ID) ?? ''
// const device_id = getCookie(DEVICE_ID) ?? ''

/**
 * 处理私聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerMessageSocket = async (data: any, msgStore: MessageStore, stateStore: StateStore) => {
	try {
		const message = data.data

		//  如果是自己的消息且设备是同一台设备，就不需要继续操作
		if (data.driverId === getCookie(DEVICE_ID)) return

		// 防止重复添加消息
		// const index = msgStore.messages.findIndex((item: any) => item?.msg_id === message?.msg_id)
		// if (index !== -1) return

		const msg = {
			dialog_id: message?.dialog_id,
			content: message?.content,
			created_at: message?.send_at,
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

		if (msgStore.dialog_id === msg.dialog_id) msgStore.updateMessage(msg)
		await UserStore.add(UserStore.tables.messages, msg)

		// 更新会话列表
		const chat = await UserStore.findOneById(UserStore.tables.dialogs, 'dialog_id', message?.dialog_id)
		chat
			? await UserStore.update(UserStore.tables.dialogs, 'dialog_id', msg.dialog_id, {
					...chat,
					last_message: {
						...chat.last_message,
						content: msg.content,
						msg_id: msg.msg_id,
						send_time: msg.created_at,
						sender_id: msg.sender_id
					},
					dialog_unread_count: chat.dialog_unread_count + 1
				})
			: stateStore.updateChat(true)
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
		// TODO: 存储对方的公钥信息
	} catch (error) {
		console.log('处理好友请求失败')
	}
}

/**
 * 收到同意或拒绝好友请求
 * @param {*} data  socket 消息
 */
export const handlerRequestResultSocket = (data: any) => {
	try {
		console.log('处理好友请求结果', data)
	} catch (error) {
		console.log('处理好友请求结果失败')
	}
}

/**
 * 处理标注消息
 * @param {*} data  socket 消息
 * @returns
 */
export const handlerLabelSocket = async (data: any, msgStore: MessageStore) => {
	try {
		//  如果是自己的消息且设备是同一台设备，就不需要继续操作
		// const user = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)
		console.log('data', data, getCookie(USER_ID), getCookie(DEVICE_ID))

		if (data?.driverId === getCookie(DEVICE_ID)) return
		const msg = data.data

		// const

		let txt = ''
		if (msg?.type === MESSAGE_TYPE.IMAGE) {
			txt = $t('[图片]')
		} else {
			const doc = new DOMParser().parseFromString(msg?.content, 'text/html')
			txt = doc.body.textContent ?? ''
		}

		const uid = (await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', msg?.dialog_id))?.find(
			(m: any) => m.msg_id === msg.id
		)?.uid

		const marks = {
			tips_msg_id: msg.id,
			content: txt,
			dialog_id: msg.dialog_id,
			pid: uid,
			uid: uuidv4(),
			is_label: msg?.is_label,
			sender_info: msg.operator_info,
			sender_id: msg.sender_id,
			type: MESSAGE_TYPE.LABEL,
			label_id: msg.sender_id
		}

		await UserStore.add(UserStore.tables.messages, marks)

		msgStore.updateMessage(marks)

		const message = await UserStore.findOneById(UserStore.tables.messages, 'uid', uid)
		// 更新数据库
		if (message) {
			const data = { ...message, is_label: marks.is_label }
			await msgStore.updateMessageById(data as any)
			await UserStore.update(UserStore.tables.messages, 'uid', uid, data)
		}

		return marks
	} catch (error) {
		console.log('处理标注失败', error)
	}
}

/**
 * 处理编辑消息
 *
 * @param {*} data  socket 消息
 * @param {MessageStore} msgStore 消息存储
 * @returns
 */
export const handlerEditSocket = async (data: any, msgStore: MessageStore) => {
	try {
		console.log('data', data, msgStore)
		//  如果是自己的消息且设备是同一台设备，就不需要继续操作
		// const user = await CommonStore.findOneById(CommonStore.tables.users, 'user_id', user_id)
		if (data?.driverId === getCookie(DEVICE_ID)) return

		const msg = (
			await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', data?.data?.dialog_id)
		).find((m: any) => m.msg_id === data.data.id)

		msg?.content && (msg.content = data.data.content)

		await UserStore.update(UserStore.tables.messages, 'id', msg.id, { ...msg })
		await msgStore.updateMessageById(msg)
	} catch (error) {
		console.log('error', error)
	}
}
