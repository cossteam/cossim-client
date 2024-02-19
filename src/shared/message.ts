import UserStore from '@/db/user'
import { getCookie } from '@/utils/cookie'
import { USER_ID } from './constanrs'
import UserService from '@/api/user'
import { isEqual } from 'lodash-es'

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
 * @param {number} msg_id -要更新的消息的 ID。
 * @param {any} msg -更新的消息对象。
 * @param {boolean} update -指示是否更新现有消息或添加新消息。默认为 false。
 * @return {Promise<void>} -当消息更新或成功添加时解析的承诺。
 */
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
