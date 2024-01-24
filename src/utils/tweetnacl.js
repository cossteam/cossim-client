import * as nacl from 'tweetnacl'
import { fromUint8Array, toUint8Array } from 'js-base64'

export function generateKeyPair() {
	const keypair = nacl.box.keyPair()
	return {
		privateKey: keypair.secretKey,
		publicKey: keypair.publicKey
	}
}

/**
 * 执行密钥交换，得到共享的对称密钥
 * @param {Uint8Array} myPrivateKey 自己的私钥
 * @param {Uint8Array} theirPublicKey 对方的公钥
 * @returns {Uint8Array} 共享的对称密钥
 */
export function performKeyExchange(myPrivateKey, theirPublicKey) {
	const sharedSecret = nacl.box.before(theirPublicKey, myPrivateKey)
	return sharedSecret
}

/**
 * 使用公钥加密消息
 * @param {Uint8Array} message 待加密的消息
 * @param {Uint8Array} nonce 随机的一次性数字
 * @param {sharedKey} theirPublicKey 共享密钥
 * @returns {Uint8Array} 加密后的消息
 */
export function encryptMessage(message, nonce, sharedKey) {
	return nacl.box.after(new TextEncoder().encode(message), nonce, sharedKey)
}

/**
 * 使用私钥解密消息
 * @param {Uint8Array} encryptedMessage 加密的消息
 * @param {Uint8Array} nonce 随机的一次性数字
 * @param {sharedKey} theirPublicKey 共享密钥
 * @returns {string} 解密后的消息
 */
export function decryptMessage(encryptedMessage, nonce, sharedKey) {
	const decryptedMessage = nacl.box.open.after(encryptedMessage, nonce, sharedKey)
	const decoder = new TextDecoder()
		.decode(decryptedMessage)
		.split(',')
		.map((v) => Number(v))
	const uint8Array = new Uint8Array(decoder)
	return new TextDecoder().decode(uint8Array)
}

/**
 * 导出共享密钥或公钥 base64
 * @param {Uint8Array} key 密钥
 */
export function exportKey(key) {
	return fromUint8Array(key)
}

/**
 * 导入公钥
 * @param {Uint8Array} key 密钥
 */
export function importKey(key) {
	return toUint8Array(key)
}

