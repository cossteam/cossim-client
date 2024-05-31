// import initSqlJs from 'sql.js'

// const SQL = await initSqlJs({ locateFile: (file: any) => `/assets/${file}` })

// const db = new SQL.Database()

// 创建表
// const createTable = () => {
// 	const createTableSQL = `
// 	  CREATE TABLE IF NOT EXISTS items (
// 		id INTEGER PRIMARY KEY AUTOINCREMENT,
// 		name TEXT,
// 		quantity INTEGER
// 	  );
// 	`
// 	db.run(createTableSQL)
// }

// const insertItem = (name, quantity) => {
// 	const insertSQL = `INSERT INTO items (name, quantity) VALUES (?, ?)`
// 	const statement = db.prepare(insertSQL)
// 	statement.run([name, quantity])
// 	statement.free()
// }

// const getItems = () => {
// 	const selectSQL = `SELECT * FROM items`
// 	const results = db.exec(selectSQL)
// 	return results.length ? results[0].values : []
// }

// // createTable()

// export const sqlTest = () => {
// 	console.log('SQL', SQL)
// 	// insertItem('apple', 10)
// 	// insertItem('banana', 5)
// 	console.log(getItems())
// }
