import { getPublicKeyApi } from '@/api/user'
import { dbService } from '@/db'
import { performKeyExchange, exportKey, importPublicKey } from '@/utils/signal/signal-crypto'

export async function getSession(user_id, friend_id) {
	try {
		const userSession = await dbService.findOneById(dbService.TABLES.SESSION, friend_id)

		if (!userSession) {
			const res = await getPublicKeyApi({ user_id: friend_id })

			if (res.code !== 200) throw new Error(res.msg)

			// 查找用户的密钥
			const user = await dbService.findOneById(dbService.TABLES.USERS, user_id)

			const result = JSON.parse(res.data?.secret_bundle || '{}')

			const publicKey = await importPublicKey(result?.publicKey)

			console.log('解析公钥', publicKey)

			const preKey = await performKeyExchange(user?.data?.keyPair, publicKey)

			const data = {
				...result,
				preKey: await exportKey(preKey)
			}

			await dbService.add(dbService.TABLES.SESSION, { user_id: friend_id, data })

			return data
		} else {
			return userSession.data
		}
	} catch (error) {
		console.error('获取 Session 失败', error)
		return null
	}
}
