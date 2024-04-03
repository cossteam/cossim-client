import useCacheStore from '@/stores/cache'
import UserService from '@/api/user'

/**
 * 根据用户 id 获取其共享密钥和共钥
 * @param {string} userId 用户 id
 * @returns
 */
export async function getCacheShareKey(userId: string) {
	const cacheStore = useCacheStore.getState()
	const user = cacheStore.cacheContacts.find((v) => v?.user_id === userId)
	if (!user) return null

	let shareKey = cacheStore.cacheShareKeys.find((v) => v.user_id === userId)

	if (!shareKey) shareKey = await getServerPublicKey(userId)

	return shareKey
}

/**
 * 根据用户 id 获取远程公钥
 * @param {string} userId 用户 id
 * @returns
 */
export async function getServerPublicKey(userId: string) {
	const { code, data } = await UserService.getPublicKeyApi({ user_id: userId })
	if (code !== 200) return null
	return data
}

/**
 * 上传或更改自己的公钥
 * @returns
 */
export async function updateServerPublicKey() {
	const cacheStore = useCacheStore.getState()
	console.log('cacheStore.cacheKeyPair', cacheStore)
	if (!cacheStore.cacheKeyPair) return
	await UserService.uploadPublicKeyApi({ secret_bundle: cacheStore.cacheKeyPair.publicKey })
}
