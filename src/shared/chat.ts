import MsgService from '@/api/msg'

interface MessageFromServerOptions {
	id: string
	is_group: boolean
	page_num?: number
	page_size?: number
}

/**
 * 对比当前信息和会话消息的 id 是否一致，如果不一致就从服务端拉取消息
 *
 * @param {number} id				好友的 user_id 或者群聊 id
 * @param {number} msg_id			当前消息 id
 * @param {number} group_id			当前群聊 id
 * @returns
 */
export const messageFromServer = async (options: MessageFromServerOptions) => {
	let reslut: any = null
	const { id, is_group, page_num = 1, page_size = 100 } = options
	try {
		const params: any = { page_num, page_size }
		if (is_group) params['group_id'] = id
		else params['user_id'] = id

		const { code, data } = is_group
			? await MsgService.getGroupMessageApi(params)
			: await MsgService.getUserMessageApi(params)

		if (code !== 200) return null
		reslut = data
	} catch (error) {
		console.error('获取消息失败', error)
	}

	return reslut
}
