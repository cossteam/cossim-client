import * as nacl from 'tweetnacl'
import { fromUint8Array, toUint8Array } from 'js-base64'

interface KeyPair {
	privateKey: Uint8Array
	publicKey: Uint8Array
}

export const generateKeyPair = (): KeyPair => {
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
export const performKeyExchange = (myPrivateKey: Uint8Array, theirPublicKey: Uint8Array): Uint8Array => {
	const sharedSecret = nacl.box.before(theirPublicKey, myPrivateKey)
	return sharedSecret
}

/**
 * 使用公钥加密消息
 * @param {string} message 待加密的消息
 * @param {string} nonce 随机的一次性数字
 * @param {Uint8Array} sharedKey 共享密钥
 * @returns {Uint8Array} 加密后的消息
 */
export const encryptMessage = (message: string, nonce: string, sharedKey: Uint8Array): string => {
	const result = { msg: message, nonce }
	try {
		result.msg = fromUint8Array(nacl.box.after(new TextEncoder().encode(message), toUint8Array(nonce), sharedKey))
	} catch (error) {
		console.log('加密失败', error)
		return JSON.stringify(result)
	}
	return JSON.stringify(result)
}

/**
 * 使用私钥解密消息
 * @param {string} encryptedMessage 加密的消息
 * @param {string} nonce 随机的一次性数字
 * @param {sharedKey} sharedKey 共享密钥
 * @returns {string} 解密后的消息
 */
export const decryptMessage = (encryptedMessage: string, nonce: string, sharedKey: Uint8Array): string => {
	const messageUint8Array = toUint8Array(encryptedMessage)
	const decryptedMessage = nacl.box.open.after(messageUint8Array, toUint8Array(nonce), sharedKey)
	return new TextDecoder().decode(decryptedMessage as Uint8Array)
}

/**
 * 解密序列化字符的消息
 * @param {string} encryptedMessage 加密的消息
 * @param {Uint8Array} sharedKey 共享密钥
 * @returns {string} 解密后的消息
 */
export const decryptMessageWithKey = (encryptedMessage: string, sharedKey: Uint8Array): string => {
	let msg = encryptedMessage
	let data: { msg: string; nonce: Uint8Array }
	try {
		data = JSON.parse(encryptedMessage)
		msg = data.msg
		return decryptMessage(data.msg, fromUint8Array(data.nonce), sharedKey)
	} catch {
		return msg
	}
}

/**
 * 导出共享密钥或公钥 base64
 * @param {Uint8Array} key 密钥
 */
export const exportKey = (key: Uint8Array): string => {
	return fromUint8Array(key)
}

/**
 * 导入公钥
 * @param {Uint8Array} key 密钥
 */
export const importKey = (key: string): Uint8Array => {
	return toUint8Array(key)
}

export const cretateNonce = (): string => {
	const randomBytes = nacl.randomBytes(24)
	return fromUint8Array(randomBytes)
}

/**
 * 导出密钥对
 * @param {Object} keyPair
 */
export const exportKeyPair = (keyPair: KeyPair): string => {
	const privateKey = exportKey(keyPair.privateKey)
	const publicKey = exportKey(keyPair.publicKey)
	return JSON.stringify({ privateKey, publicKey })
}

/**
 * 导入密钥对
 * @param {string} keyPair
 */
export const importKeyPair = (keyPair: string): KeyPair => {
	const { privateKey, publicKey } = JSON.parse(keyPair)
	return {
		privateKey: importKey(privateKey),
		publicKey: importKey(publicKey)
	}
}
