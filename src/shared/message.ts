import UserStore from '@/db/user'
import { getCookie } from '@/utils/cookie'
import { USER_ID } from './constanrs'
import UserService from '@/api/user'
import { isEqual } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { PrivateChats } from '@/types/db/user-db'
import { MESSAGE_TYPE } from '.'

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

export const sendMessage = async () => {}

export const updateMessage = async () => {}

export const deleteMessage = async () => {}

export const editMessage = async () => {}

export const markMessage = async () => {}

export const readMessage = async () => {}

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

export const addMarkMessage = async (tableName: string, msg: PrivateChats, is_label: number) => {
	try {
		const doc = new DOMParser().parseFromString(msg.content, 'text/html')
		const txt = doc.body.textContent
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
 * 更新会话
 *
 * @param {string} user_id
 * @returns
 */
