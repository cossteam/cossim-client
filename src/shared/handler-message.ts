import MsgService from '@/api/msg'

/**
 * 获取远程消息
 */
export async function getRemoteMessage(
	isGroup: boolean = false,
	id: string | number,
	page_num: number = 1,
	page_size: number = 20
) {
	let result: any = null
	try {
		const params: any = { page_num, page_size }

		if (isGroup) params['group_id'] = Number(id)
		else params['user_id'] = id

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
