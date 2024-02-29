import UserStore from '@/db/user'
import { getCookie } from '@/utils/cookie'
import { USER_ID } from './constanrs'
import UserService from '@/api/user'
import { isEqual } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { PrivateChats } from '@/types/db/user-db'
import { $t, MESSAGE_TYPE } from '.'
import MsgService from '@/api/msg'

interface CommonOptions {
	tableName: string
	dialog_id: string | number
	shareKey?: Uint8Array | null
}

export const initMessage = async (options: CommonOptions) => {
	let messages = []
	try {
		messages = await UserStore.findOneAllById(options.tableName, 'dialog_id', options.dialog_id)
		if (!messages.length) return messages

		// TODO: 取出来解密消息
	} catch (error) {
		console.error('初始化消息失败', error)
	}

	return messages
}

/**
 * 更新数据库中的消息。
 *
 * @param {string} tableName -存储消息的表的名称。
 * @param {string} uid -要更新的消息的 ID。
 * @param {any} msg -更新的消息对象。
 * @param {boolean} update -指示是否更新现有消息或添加新消息。默认为 false。
 * @return
 */
export const updateDatabaseMessage = async (
	tableName: string,
	uid: string,
	msg: PrivateChats,
	update: boolean = false
) => {
	try {
		const result = await UserStore.findOneById(tableName, 'uid', uid)

		// 添加消息
		if (!result) return await UserStore.add(tableName, msg)

		// 更新消息
		if (update) return await UserStore.update(tableName, 'uid', uid, { ...result, ...msg })
	} catch (error) {
		console.log('添加或修改消息错误', error)
	}
}

/**
 * 将标记消息添加到特定表的函数。
 *
 * @param {string} tableName -要添加标记消息的表的名称
 * @param {PrivateChats} msg -要标记的私人聊天消息
 * @param {number} is_label -指示消息是否是标签
 * @return {Promise<object>} 添加的标记消息
 */
export const addMarkMessage = async (tableName: string, msg: PrivateChats, is_label: number) => {
	try {
		let txt: string = ''
		if (msg.type === MESSAGE_TYPE.IMAGE) {
			txt = $t('[图片]')
		} else {
			const doc = new DOMParser().parseFromString(msg.content, 'text/html')
			txt = doc.body.textContent ?? ''
		}

		const user_id = getCookie(USER_ID) || ''

		const marks = {
			tips_msg_id: msg.id,
			content: txt,
			dialog_id: msg.dialog_id,
			pid: msg.uid,
			uid: uuidv4(),
			is_label: is_label,
			sender_info: msg.sender_info,
			sender_id: msg.sender_id,
			type: MESSAGE_TYPE.LABEL,
			label_id: user_id
		}

		await UserStore.add(tableName, marks)

		return marks
	} catch (error) {
		console.log('添加或修改消息错误', error)
	}
	return null
}

/**
 *  更新会话信息
 *  @param {number} dialog_id
 *  @param {PrivateChats} msg
 *  @returns
 */
export const updateDialogs = async (dialog_id: string, msg: PrivateChats) => {
	try {
		const result = await UserStore.findOneById(UserStore.tables.dialogs, 'dialog_id', dialog_id)
		if (!result) return
		// 	return await UserStore.add(UserStore.tables.dialogs, {
		// 		dialog_avatar: msg.sender_info.avatar,
		// 		dialog_id,
		// 		dialog_create_at: Date.now(),
		// 		dialog_name: msg.sender_info.nickname,
		// 		dialog_type: msg.type,
		// 		dialog_unread_count: 0,
		// 		last_message: {
		// 			content: msg.content,
		// 			msg_id: msg.msg_id,
		// 			msg_type: msg.type,
		// 			send_time: msg.create_at,
		// 			sender_id: msg.sender_id
		// 		},
		// 		top_at: 0
		// 	})
		await UserStore.update(UserStore.tables.dialogs, 'dialog_id', dialog_id, {
			...result,
			last_message: { content: msg.content, msg_id: msg.msg_id, msg_type: msg.type, send_time: msg.create_at }
		})
	} catch (error) {
		console.log('获取用户信息失败', error)
	}
}

/**
 * 判断是否是自己
 *
 * @param {string} user_id 用户 id
 * @returns {boolean}
 */
export const isMe = (user_id: string): boolean => user_id === getCookie(USER_ID) || false

/**
 * 获取远程的用户信息
 * @param {string} user_id
 * @returns
 */
export const dillServerInfo = async (user_id: string, userInfo: any) => {
	let result = null
	try {
		const { data } = await UserService.getUserInfoApi({ user_id })
		// 如果本地和远程服务器上的地址不一样就需要更新
		if (isEqual(data, userInfo)) {
			await UserStore.update(UserStore.tables.users, 'user_id', user_id, data)
			result = data
		}
	} catch (error) {
		console.log('获取用户信息失败', error)
		return null
	}
	return result
}

/**
 * 对比当前信息和会话消息的 id 是否一致，如果不一致就从服务端拉取消息
 *
 * @param {number} id				好友的 user_id 或者群聊 id
 * @param {number} msg_id			当前消息 id
 * @param {number} group_id			当前群聊 id
 * @returns
 */
export const getMessageFromServer = async (
	id: string,
	is_group: boolean,
	page_num: number = 1,
	page_size: number = 10
) => {
	let reslut: any = null
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

/**
 * 检索数组中是否包含有图片类型
 *
 * @param {Array} data
 * @returns
 */
export const hasImage = (data: any) => {
	const ops = data.ops
	for (const item of ops) {
		if (item.insert && typeof item.insert === 'object' && 'image' in item.insert) {
			return true
		}
	}
	return false
}

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
 * 滚动元素到底部
 *
 * @param element		滚动元素
 * @param isSmooth		是否平滑滚动
 */
export const scroll = (element: HTMLElement, isSmooth: boolean = false) => {
	element.scrollTo({ top: element.scrollHeight, behavior: isSmooth ? 'smooth' : 'instant' })
}
