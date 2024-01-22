import { dbService } from '@/db'
import { generateKeyPair, exportPublicKey, updatePublicKeyApi } from '@/utils/signal/signal-crypto'

// 初始化用户,用户首次登录时会自动创建
export const initUsers = async (user, signal, identity, directory) => {
	try {
		// 如果已经有了用户信息，就不需要添加
		const result = await dbService.findOneById(dbService.TABLES.USERS, user?.user_id)
		if (result) return

		// 为用户生成密钥对
		const keyPair = await generateKeyPair()

		// 添加用户
		const success = await dbService.add(dbService.TABLES.USERS, {
			user_id: user?.user_id,
			data: {
				signal,
				info: user,
				identity,
				directory,
				keyPair
			}
		})

		const secret_bundle = JSON.stringify({
			directory,
			publicKey: await exportPublicKey(keyPair?.publicKey)
		})

		// 更新公钥信息到服务器
		const res = await updatePublicKeyApi({ secret_bundle })

		if (res.code !== 200) return

		console.log('上传公钥成功', res)

		// TODO: 这里可以统一上报
		if (!success) console.log('添加用户失败')

		console.log('indexDB 添加用户成功', success)
	} catch (error) {
		console.error('初始化用户消息失败:', error)
	}
}
