import { getCookie } from '@/utils/cookie'
import { USER_ID } from './constanrs'
import { MESSAGE_READ, msgType } from '.'
import MsgService from '@/api/msg'
import useCacheStore from '@/stores/cache'
import cacheStore from '@/utils/cache'

/**
 * 判断是否是自己
 *
 * @param {string} user_id 用户 id
 * @returns {boolean}
 */
export const isMe = (user_id: string): boolean => user_id === getCookie(USER_ID) || false

/**
 * 检查给定的 HTML 字符串是否包含图像标签。
 *
 * @param {string} html -用于搜索图像标签的 HTML 字符串。
 * @return {boolean} 如果 HTML 包含图像标签，则为 true，否则为 false。
 */
export const hasImageHtml = (html: string) => {
	// 匹配 img 标签
	const imgReg = /<img[^>]+>/g
	const imgArr = html.match(imgReg)
	if (imgArr) {
		return true
	}
	return false
}

/**
 * 比对时间，对比出最新时间的群公告
 *
 * @param {Array} data  	群公告列表
 * @returns
 */
export const getLatestGroupAnnouncement = (data: any) => {
	let result = null
	for (const item of data) {
		if (!result || result.create_at < item.create_at) {
			result = item
		}
	}
	return result
}

/**
 * ++++++++++++++++++++++++++++++++++
 * 分割
 * ===================================
 */

/**
 * 排序会话列表
 *
 */
export const customSort = (a: any, b: any) => {
	if (a.top_at !== 0 && b.top_at === 0) {
		return -1 // a应该先于b
	} else if (a.top_at === 0 && b.top_at !== 0) {
		return 1 // b应该在a之前
	} else {
		// 如果两者都将top_at设为0，或者两者都具有非零的top_at
		if (a.top_at !== 0) {
			// 如果两者都有非零的top_at，则按top_at排序
			return b.top_at - a.top_at
		} else {
			// 如果两者的top_at都为0，则按last_message?.send_time 或 dialog_create_at排序
			return (
				(b?.last_message?.send_time || b?.dialog_create_at) -
				(a?.last_message?.send_time || a?.dialog_create_at)
			)
		}
	}
}

/**
 * 更新会话窗内容
 * @param {any} message		消息内容
 * @param {number} dialogId	会话 id
 */
export const updateDialog = async (message: any, dialogId: number) => {
	const cacheStore = useCacheStore.getState()
	const cacheDialogs = cacheStore.cacheDialogs.map((dialog) => {
		if (dialog.dialog_id === dialogId) {
			return { ...dialog, last_message: { ...dialog.last_message, ...message } }
		}
		return dialog
	})
	cacheStore.updateCacheDialogs(cacheDialogs)
}

/**
 * 更新缓存消息和会话
 * @param {string} tableName	表名
 * @param {any[]} messages		消息列表
 * @param {number} dialogId		会话 id
 */
export const updateCacheMessage = async (tableName: string, messages: any[], dialogId: number) => {
	await cacheStore.set(tableName, messages)
	const msg = findMessage(messages)
	await updateDialog(msg, dialogId)
}

/**
 * 查找消息
 * @param {Message[]} messages	消息列表
 * @param {number} index		索引
 * @returns any[]
 */
export const findMessage = (messages: any[], index: number = -1): Message => {
	const message = messages.at(index)

	// 如果索引超出范围，返回最后一条消息
	if (Math.abs(index) > messages.length) return messages.at(-1)

	// 如果消息类型是错误、取消标签、标签或召回，则继续查找
	if ([msgType.ERROR, msgType.CANCEL_LABEL, msgType.LABEL, msgType.RECALL].includes(message.msg_type)) {
		return findMessage(messages, index - 1)
	}

	return message
}

/**
 * 判断当前消息是否最新消息
 * @param {Message} message		消息
 */
export const isLastMessage = (message: Message) => {
	const cacheStore = useCacheStore.getState()
	const msg = cacheStore.cacheDialogs.find((dialog) => dialog.dialog_id === message.dialog_id)
	if (!msg) return false
	return msg.last_message.msg_id === message.msg_id
}

/**
 * 一键全部已读
 * @param {number[]} dialogId		会话 id
 */
export const dialogRead = async (dialogId: number, groupId?: number) => {
	const messages = await cacheStore.get(`${dialogId}`)
	// 获取未读消息的 id
	const unreadList = messages.filter(
		(message: Message) => !message?.is_read || message?.is_read === MESSAGE_READ.NOT_READ
	)
	// 获取未读消息列表 id
	const unreadIds = unreadList.map((message: Message) => message.msg_id)

	try {
		const params: any = { msg_ids: unreadIds, dialog_id: dialogId }
		if (groupId) params['group_id'] = Number(groupId)

		const { code } = groupId
			? await MsgService.readGroupMessageApi(params)
			: await MsgService.readUserMessageApi(params)

		if (code !== 200) return

		const messageList = messages.map((message: Message) => {
			if (unreadIds.includes(message.msg_id)) {
				message.is_read = MESSAGE_READ.READ
			}
			return message
		})

		// 更新未读消息列表
		await cacheStore.set(`${dialogId}`, messageList)
	} catch (error) {
		console.error('一键已读失败', error)
	}
}
