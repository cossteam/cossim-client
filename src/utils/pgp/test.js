import * as nacl from 'tweetnacl'
// import { fromUint8Array, toUint8Array, encode, decode } from 'js-base64'

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

// export function test() {
// 	// 示例用法
// 	const aliceKeyPair = generateKeyPair()
// 	const bobKeyPair = generateKeyPair()

// 	const sharedSecret = performKeyExchange(aliceKeyPair.privateKey, bobKeyPair.publicKey)

// 	console.log('aliceKeyPair', aliceKeyPair)
// 	console.log('bobKeyPair', bobKeyPair)

// 	console.log('sharedSecret', sharedSecret)

// 	const nonce = nacl.randomBytes(24)
// 	// const nonce2 = nacl.randomBytes(24)

// 	const message = 'Hello, Bob!'

// 	const encryptedMessage = encryptMessage(new TextEncoder().encode(message), nonce, sharedSecret)

// 	const msg = new TextEncoder().encode(message)

// 	console.log('encryptedMessage', encryptedMessage, msg, new TextDecoder().decode(msg))

// 	const decryptedMessage = decryptMessage(encryptedMessage, nonce, sharedSecret)

// 	console.log('decryptedMessage', decryptedMessage)
// }
