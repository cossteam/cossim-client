import userService from '@/db'
import { chatType } from '@/utils/constants'

/**
 * 添加或修改消息
 * @param {msg_id}  		消息id
 * @param {msg}  	        消息
 * @param {type}  		    聊天类型 1:单聊 0:群聊
 * @param {update}  		是否更新
 */
export const addOrUpdateMsg = async (msg_id, msg, type = chatType.PRIVATE, update = false) => {
	try {
		const result = await userService.findOneById(userService.TABLES.USER_MSGS, msg_id, 'msg_id')

		const tableName = type === chatType.GROUP ? userService.TABLES.GROUP_MSGS : userService.TABLES.USER_MSGS

		// 添加消息
		if (!result) return await userService.add(tableName, msg)

		// 更新消息
		if (update) return await userService.update(tableName, msg_id, { ...result, ...msg }, 'msg_id')
	} catch (error) {
		console.log('添加或修改消息错误', error)
	}
}

/**
 * 更新会话，如果不存在就添加，如果存在就判断是否是最新的，如果不是就修改
 * @param {*} msg
 * @returns
 */
export const updateChat = async (msg) => {
	try {
		const result = await userService.findOneById(userService.TABLES.CHATS, msg.dialog_id, 'dialog_id')

		// 1、如果没有该会话就不需要更新
		if (!result) return
		// 2、如果是最新的就不需要更新
		if (result.msg_id === msg.msg_id) return

		await userService.update(userService.TABLES.CHATS, msg.dialog_id, {
			...result,
			last_message: msg.msg_content,
			msg_id: msg.msg_id,
			msg_type: msg.msg_type,
			send_time: msg.msg_send_time
		})
	} catch (error) {
		console.log(' 更新会话失败', error)
	}
}
