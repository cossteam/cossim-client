import { fromUint8Array, toUint8Array } from 'js-base64'

/**
 * 生成密钥对，用于密钥交换
 * @returns
 */
export async function generateKeyPair() {
	return crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey'])
}

/**
 * 执行密钥交换，得到共享的对称密钥
 * @param {CryptoKeyPair} myKeyPair 		自己的密钥对
 * @param {CryptoKey} theirPublicKey 		对方的公钥
 * @returns Promise<CryptoKey>
 */
export async function performKeyExchange(myKeyPair, theirPublicKey) {
	try {
		// 使用对方的公钥和自己的私钥进行 Diffie-Hellman 密钥交换
		const sharedSecret = await crypto.subtle.deriveKey(
			{ name: 'ECDH', public: theirPublicKey },
			myKeyPair.privateKey,
			{ name: 'AES-GCM', length: 256 },
			true,
			['encrypt', 'decrypt']
		)

		return sharedSecret
	} catch (error) {
		console.error('执行密钥交换时出错:', error.message)
		throw error
	}
}

/**
 * 加密消息
 * @param {CryptoKey} actualKey 		共享密钥
 * @param {string} plaintext 			要加密的消息
 * @returns
 */
export async function encryptMessage(actualKey, plaintext) {
	try {
		const encodedText = new TextEncoder().encode(plaintext)

		// 随机生成一个 IV
		const iv = crypto.getRandomValues(new Uint8Array(12))

		// 使用 AES-GCM 进行加密
		const ciphertext = await crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			actualKey,
			encodedText
		)

		// 将 IV 附加到加密的消息中，用于解密
		const result = new Uint8Array(ciphertext.byteLength + iv.byteLength)
		result.set(new Uint8Array(ciphertext), 0)
		result.set(iv, ciphertext.byteLength)

		return fromUint8Array(new Uint8Array(result.buffer))
	} catch (error) {
		console.error('Error encrypting message:', error)
		throw error
	}
}

/**
 * 解密消息
 * @param {CryptoKey} actualKey 				共享密钥
 * @param {string} encryptedMessage 		要解密的消息
 * @returns
 */
export async function decryptMessage(actualKey, encryptedMessage) {
	try {
		encryptedMessage = toUint8Array(encryptedMessage).buffer

		// 从加密的消息中提取 IV
		const iv = new Uint8Array(encryptedMessage.slice(-12))

		// 提取实际的加密数据
		const ciphertext = encryptedMessage.slice(0, encryptedMessage.byteLength - 12)

		// 使用 AES-GCM 进行解密
		const decrypted = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			actualKey,
			ciphertext
		)

		const decryptedText = new TextDecoder().decode(decrypted)
		return decryptedText
	} catch (error) {
		console.error('Error decrypting message:', error)
		throw error
	}
}

/**
 * 导出公钥为 Base64 字符串
 * @param {CryptoKey} key
 * @returns
 */
export async function exportPublicKey(key) {
	try {
		const publicKey = await crypto.subtle.exportKey('spki', key)
		return fromUint8Array(new Uint8Array(publicKey))
	} catch (error) {
		console.error('Error exporting public key:', error)
		throw error
	}
}

/**
 * 导入公钥
 * @param {string} publicKey
 * @returns
 */
export async function importPublicKey(publicKey) {
	try {
		const buffer = toUint8Array(publicKey).buffer
		const importedKey = await crypto.subtle.importKey(
			'spki',
			buffer,
			{ name: 'ECDH', namedCurve: 'P-256' },
			true,
			[]
		)
		return importedKey
	} catch (error) {
		console.error('Error importing public key:', error)
		throw error
	}
}

/**
 * 导出共享密钥
 * @param {CryptoKey} key
 * @returns
 */
export async function exportKey(key) {
	try {
		const exportedKey = await crypto.subtle.exportKey('raw', key)
		return fromUint8Array(new Uint8Array(exportedKey))
	} catch (error) {
		console.error('Error exporting key:', error)
		throw error
	}
}

/**
 * 导入共享密钥
 * @param {string} key
 * @returns
 */
export async function importKey(key) {
	try {
		const buffer = toUint8Array(key).buffer
		const importedKey = await crypto.subtle.importKey('raw', buffer, { name: 'AES-GCM', length: 256 }, true, [
			'encrypt',
			'decrypt'
		])
		return importedKey
	} catch (error) {
		console.error('Error importing key:', error)
		throw error
	}
}
