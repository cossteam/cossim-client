import MsgService from '@/api/msg'
import { msgType } from './enum'

interface RemoteMessageOptions {
	isGroup: boolean
	id: string | number
	page_num: number
	page_size: number
	msg_id: number
}

/**
 * 获取远程消息
 */
export async function getRemoteMessage({
	isGroup = false,
	id,
	page_num = 1,
	page_size = 20,
	msg_id = 0
}: RemoteMessageOptions) {
	let result: any = null
	try {
		const params: any = { page_num, page_size, msg_id, dialog_id: id }

		// if (isGroup) params['group_id'] = Number(id)
		// else params['user_id'] = id

		const { code, data } = isGroup
			? await MsgService.getGroupMessageApi(params)
			: await MsgService.getUserMessageApi(params)

		if (code !== 200) return null

		result = data
	} catch (error) {
		console.error('获取远程消息失败：', error)
	}
	return result
}

/**
 * 查找消息 id
 * @param {Message[]} messages	消息列表
 * @param {number} index		索引
 * @returns any[]
 */
export const findMessageId = (messages: any[], index: number = -1): number => {
	if (!messages.length) return 0

	const message = messages.at(index)

	// 如果索引超出范围，返回最后一条消息
	if (Math.abs(index) > messages.length) return messages.at(-1)?.msg_id

	// 如果消息类型是错误，查找上一条消息
	if ([msgType.ERROR].includes(message.msg_type)) {
		return findMessageId(messages, index - 1)
	}

	return message.msg_id
}
