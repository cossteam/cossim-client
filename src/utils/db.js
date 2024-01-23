export class dbService {
	constructor(options) {
		const { db, tables, primary_key } = options

		if (typeof tables !== 'object') throw new Error('tables should be an object')
		if (typeof primary_key !== 'string') throw new Error('primary_key should be a string')

		this.TABLES = Object.assign({}, ...Object.keys(tables).map((key) => ({ [key.toLocaleUpperCase()]: key })))
		this.DB = db
		this.PRIMARY_KEY = primary_key
	}

	/**
	 * 根据ID查找指定表中的一条记录。
	 *
	 * @param {string} table -要搜索的表的名称。
	 * @param {any} id -要查找的记录的 ID。
	 * @param {string} key -要查找的字段的名称。
	 * @return {Promise<any>} 一个用找到的记录解析的承诺。
	 */
	async findOneById(table, id, key) {
		return (
			this.DB[table] &&
			(await this.DB[table]
				.where(key || this.PRIMARY_KEY)
				.equals(id)
				.first())
		)
	}

	/**
	 * 查找指定表中的所有记录。
	 *
	 * @param {string} table -要从中检索记录的表的名称。
	 * @return {Promise<any[]>} 指定表中的记录数组。
	 */
	async findAll(table) {
		return this.DB[table] && (await this.DB[table].toArray())
	}

	/**
	 * 将数据添加到 this.DB 中的指定表。
	 *
	 * @param {string} table -要添加数据的表的名称。
	 * @param {object} data -要添加到表中的数据。
	 * @return {Promise} 成功添加数据后解析的承诺。
	 */
	async add(table, data) {
		return this.DB[table] && (await this.DB[table].add(data))
	}

	/**
	 * 使用给定的 ID 和数据更新指定表中的记录。
	 *
	 * @param {string} table -要更新记录的表的名称。
	 * @param {string} id -要更新的记录的 ID。
	 * @param {object} data -用于更新记录的数据。
	 * @return {Promise} 解析为更新记录的 Promise。
	 */
	async update(table, id, data, key) {
		// return this.DB[table] && (await this.DB[table].update(id, data))
		return (
			this.DB[table] &&
			(await this.DB[table]
				.where(key || this.PRIMARY_KEY)
				.equals(id)
				.modify(data))
		)
	}

	/**
	 * 使用提供的 id 从指定表中删除记录。
	 *
	 * @param {string} table -要从中删除的表的名称。
	 * @param {number} id -要删除的记录的 id。
	 * @return {Promise} 成功删除记录时解析的承诺。
	 */
	async delete(table, id, key) {
		return (
			this.DB[table] &&
			this.DB.contacts
				.where(key || this.PRIMARY_KEY)
				.equals(id)
				.delete()
		)
	}

	/**
	 * 删除指定表中的所有记录。
	 *
	 * @param {string} table -要从中删除记录的表的名称。
	 * @return {Promise} -当所有记录都被删除时解决的承诺。
	 */
	async deleteAll(table) {
		return this.DB[table] && (await this.DB[table].clear())
	}
}
