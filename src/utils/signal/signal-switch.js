// import { switchE2EKeyApi } from '@/api/relation'
import { dbService } from "@/db"

// /**
//  * 交换公钥
//  * @param {*} data 
//  * @returns 
//  */
// export async function switchE2EKey(data) {
//     const res = await switchE2EKeyApi(data)
// }

/**
 * 交换公钥
 * @param {string} user_id
 * @returns
 */
export async function switchE2EKey(user_id) {
    // 查找本地是否已经存有对方的公钥
    const user = await dbService.findOneById(dbService.TABLES.USERS, user_id)
    // 如果已经有了就不需要再存了
    if(user) return 
}