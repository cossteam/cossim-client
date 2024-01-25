import { dbService } from '@/utils/db'
import { BASE_VERSION, BASE_KEYS, BASE_PRIMARY_KEY, BASE_COMMON_NAME } from './constants'

// 表名
const TABLE_NAMES = ['history']

// 数据表
const TABLES = Object.assign({}, ...TABLE_NAMES.map((table) => ({ [table]: BASE_KEYS })))

const commonService = new dbService({
	name: BASE_COMMON_NAME,
	version: BASE_VERSION,
	tables: TABLES,
	primary_key: BASE_PRIMARY_KEY
})

export default commonService
