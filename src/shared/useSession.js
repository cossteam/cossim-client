import { getPublicKeyApi } from '@/api/user'
import { dbService } from '@/db'

export async function useSession(user_id) {
	try {
        let data = null
		const userSession = await dbService.findOneById(dbService.TABLES.SESSION, user_id)
		if (!userSession) {
			const res = await getPublicKeyApi({ user_id })
			if (res.code !== 200) throw new Error(res.msg)
			return JSON.parse(res.data)
		} else {
			return userSession.data
		}
	} catch (error) {
		console.error('获取 Session 失败', error)
		return {}
	}
}
