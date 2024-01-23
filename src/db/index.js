import Dexie from 'dexie'
import { getStorage } from '@/utils/stroage'

const state = getStorage()?.state?.user

console.log("state",state);

// COSSIM 客户端数据库
const user_id =  state?.user_id || state?.dbName ||  'DB'
const WebDB = new Dexie(`COSSIM_${user_id}`)

export const PRIMARY_KEY = 'user_id'

/**
 * 数据库版本号
 * Dexie.semVer	Dexie.version
 * "1.0.0"      1.0
 * "1.0.1"      1.0001
 * "1.1.0"      1.01
 * "1.3.4"      1.0304
 */
const WEBDB_VERSION = 1.0001 // 对表结构进行修改时需要进版本号修改

const BASE_KEYS = 'user_id, data'

// contacts, chats, messages
const TABLE_NAMES = ['session', 'users', 'msgs', 'pgpkeys']

const TABLES = {
	// 建立唯一索引在 字段 前添加 & 符号
	// 联系人
	contacts: `
		++id,
		group,
		&user_id,
		avatar,
		name,
		nick_name,
		email,
		signature,
		status`,
	// 会话
	chats: `
		++id,
		&dialog_id,
		user_id,
		dialog_type,
		dialog_name,
		dialog_avatar,
		dialog_unread_count,
		msg_type,
		last_message,
		sender_id,
		send_time,
		msg_id`,
	// 消息：send_state(客户端消息发送时状态)：'sending' => 'ok' or 'err'
	messages: `
		++id,
		msg_id,
		sender_id,
		receiver_id,
		content,
		content_type,
		type,
		reply_id,
		read_at,
		created_at,
		dialog_id,
		send_state`,
	...Object.assign({}, ...TABLE_NAMES.map((table) => ({ [table]: BASE_KEYS })))
}

WebDB.version(WEBDB_VERSION).stores(TABLES)

export class dbService {
	static TABLES = Object.assign({}, ...Object.keys(TABLES).map((key) => ({ [key.toLocaleUpperCase()]: key })))

	/**
	 * 根据ID查找指定表中的一条记录。
	 *
	 * @param {string} table -要搜索的表的名称。
	 * @param {any} id -要查找的记录的 ID。
	 * @param {string} key -要查找的字段的名称。
	 * @return {Promise<any>} 一个用找到的记录解析的承诺。
	 */
	static async findOneById(table, id, key) {
		return WebDB[table] && (await WebDB[table].where(key || PRIMARY_KEY).equals(id).first())
	}

	/**
	 * 查找指定表中的所有记录。
	 *
	 * @param {string} table -要从中检索记录的表的名称。
	 * @return {Promise<any[]>} 指定表中的记录数组。
	 */
	static async findAll(table) {
		return WebDB[table] && (await WebDB[table].toArray())
	}

	/**
	 * 将数据添加到 WebDB 中的指定表。
	 *
	 * @param {string} table -要添加数据的表的名称。
	 * @param {object} data -要添加到表中的数据。
	 * @return {Promise} 成功添加数据后解析的承诺。
	 */
	static async add(table, data) {
		return WebDB[table] && (await WebDB[table].add(data))
	}

	/**
	 * 使用给定的 ID 和数据更新指定表中的记录。
	 *
	 * @param {string} table -要更新记录的表的名称。
	 * @param {string} id -要更新的记录的 ID。
	 * @param {object} data -用于更新记录的数据。
	 * @return {Promise} 解析为更新记录的 Promise。
	 */
	static async update(table, id, data, key) {
		// return WebDB[table] && (await WebDB[table].update(id, data))
		return WebDB[table] && (await WebDB[table].where(key || PRIMARY_KEY).equals(id).modify(data))
	}

	/**
	 * 使用提供的 id 从指定表中删除记录。
	 *
	 * @param {string} table -要从中删除的表的名称。
	 * @param {number} id -要删除的记录的 id。
	 * @return {Promise} 成功删除记录时解析的承诺。
	 */
	static async delete(table, id, key) {
		return WebDB[table] &&  WebDB.contacts.where(key || PRIMARY_KEY).equals(id).delete()
	}

	/**
	 * 删除指定表中的所有记录。
	 *
	 * @param {string} table -要从中删除记录的表的名称。
	 * @return {Promise} -当所有记录都被删除时解决的承诺。
	 */
	static async deleteAll(table) {
		return WebDB[table] && (await WebDB[table].clear())
	}
}

export default WebDB
console.log(`IndexedDB\n【COSSIM_${user_id}】\nReady...`)
