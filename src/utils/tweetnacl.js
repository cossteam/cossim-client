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
 * @param {string} message 待加密的消息
 * @param {Uint8Array} nonce 随机的一次性数字
 * @param {sharedKey} theirPublicKey 共享密钥
 * @returns {Uint8Array} 加密后的消息
 */
export function encryptMessage(message, nonce, sharedKey) {
	const reslut = { msg: message, nonce }
	try {
		reslut.msg = fromUint8Array(nacl.box.after(new TextEncoder().encode(message), toUint8Array(nonce), sharedKey))
	} catch (error) {
		console.error('加密失败：', error.message)
		return JSON.stringify(reslut)
	}
	console.log('加密的消息:', reslut)
	return JSON.stringify(reslut)
}

/**
 * 使用私钥解密消息
 * @param {string} encryptedMessage 加密的消息
 * @param {string} nonce 随机的一次性数字
 * @param {sharedKey} sharedKey 共享密钥
 * @returns {string} 解密后的消息
 */
export function decryptMessage(encryptedMessage, nonce, sharedKey) {
	encryptedMessage = toUint8Array(encryptedMessage)
	const decryptedMessage = nacl.box.open.after(encryptedMessage, toUint8Array(nonce), sharedKey)
	return new TextDecoder().decode(decryptedMessage)
}

/**
 * 解密序列化字符的消息
 * @param {string} encryptedMessage 加密的消息
 * @param {Uint8Array} sharedKey 共享密钥
 * @returns {string} 解密后的消息
 */
export function decryptMessageWithKey(encryptedMessage, sharedKey) {
	let msg = encryptedMessage
	let data = {}
	try {
		data = JSON.parse(encryptedMessage)
		msg = data.msg
		return decryptMessage(data.msg, data.nonce, sharedKey)
	} catch {
		return data?.content || msg
	}
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

export function cretateNonce() {
	const randomBytes = nacl.randomBytes(24)
	// console.log('nacl.randomBytes(24)', randomBytes,fromUint8Array(randomBytes),toUint8Array(fromUint8Array(randomBytes)))
	return fromUint8Array(randomBytes)
}

export function test() {
	// 示例用法
	const aliceKeyPair = generateKeyPair()
	const bobKeyPair = generateKeyPair()

	const sharedSecret1 = performKeyExchange(aliceKeyPair.privateKey, bobKeyPair.publicKey)
	const sharedSecret2 = performKeyExchange(bobKeyPair.privateKey, aliceKeyPair.publicKey)

	console.log('aliceKeyPair', aliceKeyPair)
	console.log('bobKeyPair', bobKeyPair)

	console.log('sharedSecret1', sharedSecret1)
	console.log('sharedSecret2', sharedSecret2)

	const nonce = cretateNonce()

	const message = 'Hello, Bob!'

	const encryptedMessage = encryptMessage(message, nonce, sharedSecret1)

	const msg = { msg: encryptedMessage, nonce: nonce }

	console.log('encryptedMessage', msg)

	const decryptedMessage = decryptMessage(msg.msg, msg.nonce, sharedSecret2)
	console.log('decryptedMessage', decryptedMessage)
}
