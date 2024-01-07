import sql from 'sql.js'

// 需要让 webpack 4 知道它需要将 wasm 文件复制到我们的资产中
// import sqlWasm from '!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm'

const TABLE = {
	// 用户表
	USER: 'users',
	// 消息列表
	MESSAGE: 'messages',
	// 聊天记录
	CHAT_RECORD: 'chat_record',
	// 好友列表
	FRIENDS: 'friends',
	// 群组列表
	GROUPS: 'groups',
	// 群组成员列表
	GROUP_MEMBERS: 'group_members',
	// 群组消息列表
	GROUP_MESSAGES: 'group_messages'
}

const CREATE_TABLE = {
	// 用户表
	USER: `
        CREATE TABLE IF NOT EXISTS ${TABLE.USER} (
            user_id INTEGER PRIMARY KEY COMMENT '用户id', 
            nick_name TEXT COMMENT '用户名·', 
            email TEXT COMMENT '用户邮箱', 
            avatar TEXT COMMENT '用户头像', 
            created_at TEXT COMMENT '创建时间',
            updated_at TEXT COMMENT '更新时间'
        )
    `,
	// 消息列表
	MESSAGE: `
        CREATE TABLE IF NOT EXISTS ${TABLE.MESSAGE} (
            user_id INTEGER PRIMARY KEY COMMENT '用户id', 
            from_id INTEGER, to_id INTEGER COMMENT '用户id', 
            content TEXT, type TEXT COMMENT '内容', 
            created_at TEXT, updated_at TEXT
        )
    `,
	// 聊天记录
	CHAT_RECORD: `
        CREATE TABLE IF NOT EXISTS ${TABLE.CHAT_RECORD} (
            id INTEGER PRIMARY KEY, 
            from_id INTEGER, to_id INTEGER, 
            content TEXT, type TEXT, 
            created_at TEXT, updated_at TEXT
        )
    `,
	// 好友列表
	FRIENDS: `
        CREATE TABLE IF NOT EXISTS ${TABLE.FRIENDS} (
            id INTEGER PRIMARY KEY, 
            from_id INTEGER, to_id INTEGER, 
            created_at TEXT, updated_at TEXT
        )
    `,
	// 群组列表
	GROUPS: `
        CREATE TABLE IF NOT EXISTS ${TABLE.GROUPS} (
            id INTEGER PRIMARY KEY, 
            name TEXT, avatar TEXT, 
            created_at TEXT, updated_at TEXT
        )
    `,
	// 群组成员列表
	GROUP_MEMBERS: `
        CREATE TABLE IF NOT EXISTS ${TABLE.GROUP_MEMBERS} (
            id INTEGER PRIMARY KEY, 
            group_id INTEGER, user_id INTEGER, 
            created_at TEXT, updated_at TEXT
        )
    `,
	// 群组消息列表
	GROUP_MESSAGES: `
        CREATE TABLE IF NOT EXISTS ${TABLE.GROUP_MESSAGES} (
            id INTEGER PRIMARY KEY, 
            group_id INTEGER, user_id INTEGER, 
            content TEXT, type TEXT, 
            created_at TEXT, updated_at TEXT
        )
    `
}

export default class DBHelper {
	/**
	 * 初始化数据库
	 * @param {string} storeName
	 * @returns
	 */
	constructor(storeName = 'COSS_DB') {
		// 创建数据库
		this.db = sql.open('sqlite', storeName)
	}

	/**
	 * 创建表格
	 * @param {*} sql   sql 语句
	 */
	async createTable(sql) {
		let stmt = this.db.prepare(sql)
		stmt.run()
		stmt.finalize()
	}

	/**
	 * 插入数据
	 * @param {*} sql   sql 语句
	 * @param {*} data  插入数据
	 * @returns
	 */
	async insert(sql, data) {
		let stmt = this.db.prepare(sql)
		//     `
		//     INSERT INTO users (
		//         name, email,
		//         password, phone,
		//         address, city,
		//         state, country,
		//         zip, created_at,
		//         updated_at
		//     ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
		// `)
		stmt.run(data)
		stmt.finalize()
		return this.db.lastInsertRowid
	}

	/**
	 * 查询数据
	 * @param {*} sql   sql 语句
	 * @returns
	 */
	async select(sql) {
		let stmt = this.db.prepare(sql)
		let result = stmt.getAsObject()
		stmt.finalize()
		return result
	}

	async update(id, data) {
		let stmt = this.db.prepare(`
            UPDATE users SET 
                name =?, email =?, 
                password =?, phone =?, 
                address =?, city =?, 
                state =?, country =?, 
                zip =?, created_at =?, 
                updated_at =? 
            WHERE id =?
        `)
		stmt.run(
			data.name,
			data.email,
			data.password,
			data.phone,
			data.address,
			data.city,
			data.state,
			data.country,
			data.zip,
			data.created_at,
			data.updated_at,
			id
		)
		stmt.finalize()
		return id
	}

	async delete(id) {
		let stmt = this.db.prepare(`
            DELETE FROM users WHERE id =?
        `)
		stmt.run(id)
		stmt.finalize()
		return id
	}

	async get(id) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE id =?
        `)
		let result = stmt.getAsObject(id)
		stmt.finalize()
		return result
	}

	async getByName(name) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE name =?
        `)
		let result = stmt.getAsObject(name)
		stmt.finalize()
		return result
	}

	async getByEmail(email) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE email =?
        `)
		let result = stmt.getAsObject(email)
		stmt.finalize()
		return result
	}

	async getByPhone(phone) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE phone =?
        `)
		let result = stmt.getAsObject(phone)
		stmt.finalize()
		return result
	}

	async getByAddress(address) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE address =?
        `)
		let result = stmt.getAsObject(address)
		stmt.finalize()
		return result
	}

	async getByCity(city) {
		let stmt = this.db.prepare(`
            SELECT * FROM users WHERE city =?
        `)
		let result = stmt.getAsObject(city)
		stmt.finalize()
		return result
	}
}
