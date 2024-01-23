//! 现在暂时存留，后续可能会使用
import Dexie from 'dexie'
import { dbService } from '@/utils/db'
import { BASE_VERSION , BASE_KEYS , BASE_PRIMARY_KEY, BASE_COMMON_NAME} from './constants'

// 表名 会话列表，联系人列表，消息列表
const TABLE_NAMES = ['chats','contacts', 'msgs']

// 数据表
const TABLES = Object.assign({}, ...TABLE_NAMES.map((table) => ({ [table]: BASE_KEYS })))

// 数据库
const DB = new Dexie(BASE_COMMON_NAME).version(BASE_VERSION).stores(TABLES)

const userService = new dbService(DB, TABLES, BASE_PRIMARY_KEY)

export default userService
