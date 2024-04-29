import useCacheStore from '@/stores/cache'
import UserService from '@/api/user'
import { cretateNonce, decryptMessageWithKey, encryptMessage, generateKeyPair, performKeyExchange } from '.'

/**
 * 根据用户 id 获取其共享密钥
 * @param {string} userId 用户 id
 * @returns
 */
export async function getCacheShareKey(userId: string) {
	const cacheStore = useCacheStore.getState()
	let shareKey: any = cacheStore.cacheShareKeys.find((v) => v.user_id === userId)?.shareKey

	if (!shareKey) {
		const publicKey = await getServerPublicKey(userId)
		shareKey = performKeyExchange(cacheStore.cacheKeyPair?.privateKey ?? '', publicKey)
		// 更新本地数据库
		const cacheShareKeys = !cacheStore.cacheShareKeys.length
			? [{ user_id: userId, shareKey }]
			: cacheStore.cacheShareKeys.map((item) => (item.user_id === userId ? { ...item, shareKey } : item))
		cacheStore.update({ cacheShareKeys }, true)
	}

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
	return data?.secret_bundle ?? ''
}

/**
 * 上传或更改自己的公钥
 * @returns
 */
export async function updateServerPublicKey() {
	const cacheStore = useCacheStore.getState()
	if (!cacheStore.cacheKeyPair) return
	await UserService.uploadPublicKeyApi({ secret_bundle: cacheStore.cacheKeyPair.publicKey })
}

/**
 * 生成密钥对并上传
 * @returns
 */
export function uploadPublicKey() {
	const cacheStore = useCacheStore.getState()
	const cacheKeyPair = generateKeyPair()
	cacheStore.update({ cacheKeyPair }, true)
	updateServerPublicKey()
}

/**
 * 传入用户 id 和要加密的消息进行加密
 * @param {string} userId 用户 id
 * @param {string} content 消息内容
 * @returns {string} 加密后的内容
 */
export async function encrypt(userId: string, content: string) {
	const shareKey = await getCacheShareKey(userId)
	const nonce = cretateNonce()
	return encryptMessage(content, nonce, shareKey)
}

/**
 * 传入用户 id 和加密后的消息进行解密
 * @param {string} userId 用户 id
 * @param {string} content 消息内容
 * @returns {string} 解密后的内容
 */
export async function decrypt(userId: string, content: string) {
	try {
		const shareKey = await getCacheShareKey(userId)
		const message = decryptMessageWithKey(content, shareKey)
		return message
	} catch {
		return content
	}
}

/**
 * 添加好友共钥到本地
 * @param {string} userId 用户 id
 * @param {string} publicKey 用户公钥
 */
export function savePublicKey(userId: string, publicKey: string) {
	const cacheStore = useCacheStore.getState()
	const user = cacheStore.cacheShareKeys.find((v) => v?.user_id === userId)
	if (!cacheStore.cacheKeyPair) return

	const shareKey = performKeyExchange(cacheStore.cacheKeyPair?.privateKey, publicKey)

	// 如果不存在则添加
	if (!user) {
		cacheStore.update({ cacheShareKeys: [...cacheStore.cacheShareKeys, { user_id: userId, shareKey }] }, true)
		return
	}

	// 如果存在则更新
	cacheStore.update(
		{
			cacheShareKeys: cacheStore.cacheShareKeys.map((item) =>
				item?.user_id === userId ? { ...item, shareKey } : item
			)
		},
		true
	)
}
