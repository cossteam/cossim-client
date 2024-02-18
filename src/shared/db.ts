import { Dexie } from 'dexie'
import type { ServiceMixin, serviceOptions } from '@/types/db/db'

/**
 * TODO：1、存储数据时加密数据 2、查找数据时解密
 */
export class ServiceImpl implements ServiceMixin {
	public db: Dexie
	public defaultKey: string
	public tables: { [key: string]: string } = {}

	constructor(options: serviceOptions) {
		if (!options.db) throw new Error('++++未找到数据库实例++++')
		this.db = options.db
		this.defaultKey = options.defaultKey ?? 'user_id'

		this.db.tables.forEach((table) => {
			this.tables[table.name] = table.name
		})
	}

	/**
	 * 通过给定的键和值查找指定表中的记录。
	 *
	 * @param {string} tableName -表的名称
	 * @param {string} key -搜索的键
	 * @param {string} value -要搜索的值
	 * @return 解析为找到的记录的承诺
	 */
	async findOneById(tableName: string, key: string = this.defaultKey, value: string | number) {
		return await this.db.table(tableName).get({ [key]: value })
	}

	/**
	 * 异步查找指定表中具有指定键值对的所有记录。
	 *
	 * @param {string} tableName -要搜索的表的名称
	 * @param {string} [key=] -要搜索的键（默认值为 this.defaultKey）
	 * @param {string} value -要搜索的值
	 * @return 与指定键值对匹配的记录数组
	 */
	async findOneAllById(tableName: string, key: string = this.defaultKey, value: string | number) {
		return await this.db.table(tableName).where(key).anyOf(value).toArray()
	}

	/**
	 * 按ID查找表中的所有记录。
	 *
	 * @param {string} tableName -表的名称
	 * @return  记录数组
	 */
	async findAll(tableName: string) {
		return await this.db.table(tableName).toArray()
	}

	/**
	 * 将数据添加到数据库中的指定表中。
	 *
	 * @param {string} table -要添加数据的表的名称
	 * @param {any} data -要添加到表中的数据
	 * @return 一个承诺，解析为将数据添加到表中的结果
	 */
	async add(table: string, data: any) {
		return await this.db.table(table).add(data)
	}

	/**
	 * 批量添加数据到数据库中的指定表中。
	 *
	 * @param {string} table -要添加数据的表的名称
	 * @param {any[]} data -要添加到表中的数据
	 * @return 一个承诺，解析为将数据添加到表中的结果
	 */
	async bulkAdd(table: string, data: any[]) {
		return await this.db.table(table).bulkAdd(data)
	}

	/**
	 * 更新指定表中的一条记录。
	 *
	 * @param {string} table -表的名称
	 * @param {string} key -标识记录的键（默认是this.defaultKey）
	 * @param {string} value -与键匹配的值
	 * @param {any} data -更新后的数据
	 * @return  解析为修改后的数据的承诺
	 */
	async update(table: string, key: string = this.defaultKey, value: string | number, data: any) {
		return await this.db.table(table).where(key).equals(value).modify(data)
	}

	/**
	 * 根据提供的键和值从指定表中异步删除记录。
	 *
	 * @param {string} table -要从中删除记录的表的名称
	 * @param {string} [key=] -用于删除的键，默认为 this.defaultKey
	 * @param {string} value -用于删除的值
	 * @return 删除记录时解析的承诺
	 */
	async delete(table: string, key: string = this.defaultKey, value: string | number) {
		return await this.db.table(table).where(key).equals(value).delete()
	}

	/**
	 * 清除数据库中指定的表。
	 *
	 * @param {string} table -要清除的表的名称
	 * @return  清除表时解析的 Promise
	 */
	async clear(table: string) {
		return await this.db.table(table).clear()
	}
}
