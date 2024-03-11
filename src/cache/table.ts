import Dexie, { Table } from 'dexie'
import { CommonTableOptions } from './type'

class CommonTable extends Dexie {
	common!: Table<CommonTableOptions>

	constructor(name: string, version: number = 1) {
		super(name)
		this.version(version).stores({
			/**
			 * | cacheDialogs           缓存的对话列表
			 * | cacheEmojis            缓存的表情列表
			 * | cacheFileSort          缓存的文件排序
			 * | cacheLoginEmail        缓存的登录邮箱
			 * | cacheUserBasic         缓存的用户基本信息
			 * | cacheVersion           缓存的版本号
			 * | callAt                 at 信息列表
			 * | clientId               客户端 id
			 * | dialogUnread           对话未读
			 * | userInfo               用户基本信息
			 */
			common: `
                ++id,
                cacheDialogs, 
                cacheEmojis, 
                cacheFileSort, 
                cacheLoginEmail, 
                cacheUserBasic, 
                cacheVersion, 
                callAt, 
                clientId, 
                dialogUnread, 
                userInfo
            `
		})
	}
}

export default CommonTable
