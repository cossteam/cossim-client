import UserStore from '@/db/user'
import { getCookie } from '@/utils/cookie'
import { USER_ID } from './constanrs'

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

export const updateDatabaseMessage = async (tableName: string, msg_id: number, msg: any, update: boolean = false) => {
	try {
		const result = await UserStore.findOneById(tableName, 'msg_id', msg_id)

		// 添加消息
		if (!result) return await UserStore.add(tableName, msg)

		// 更新消息
		if (update) return await UserStore.update(tableName, 'msg_id', msg_id, { ...result, ...msg })
	} catch (error) {
		console.log('添加或修改消息错误', error)
	}
}

/**
 * 判断是否是自己
 *
 * @param {string} user_id 用户 id
 * @returns {boolean}
 */
export const isMe = (user_id: string): boolean => user_id === getCookie(USER_ID) || false
