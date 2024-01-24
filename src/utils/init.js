// import { dbService } from '@/db'
// import { exportPublicKey, importPublicKey } from '@/utils/signal/signal-crypto'
import commonService from '@/db/common'
import { updatePublicKeyApi } from '@/api/user'
import { exportKey } from '@/utils/tweetnacl'

/**
 * 初始化用户,用户首次登录时会自动创建
 * TODO: 如果是新设备登录需要做一些额外操作，例如：同步数据，传递私钥
 * @param {*} user
 * @returns
 */
export const useInitUser = async (user) => {
	try {
		const id = user?.user_id

		// 如果已经有了用户信息，就不需要添加
		const result = await commonService.findOneById(commonService.TABLES.HISTORY, id)

		// 首次注册后登录需要上传公钥到服务端
		if (result && result.data?.isFirst) {
			// 上传公钥
			const secret_bundle = JSON.stringify({
				publicKey: exportKey(result?.data.keyPair?.publicKey)
			})
			const res = await updatePublicKeyApi({ secret_bundle })

			if (res.code !== 200) return console.error('上传公钥失败', res)

			// 更新用户信息
			await commonService.update(commonService.TABLES.HISTORY, id, {
				data: {
					...result.data,
					isFirst: false
				}
			})
		}
	} catch (error) {
		console.error('初始化用户消息失败:', error)
	}
}
