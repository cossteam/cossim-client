import { fromUint8Array, toUint8Array } from 'js-base64'
import * as openpgp from 'openpgp'

/**
 * 生成密钥对，用于密钥交换
 * @returns
 */
export async function generateKeyPair(user, passphrase) {
	try {
		if (!user) return
		const keyPair = await openpgp.generateKey({
			passphrase,
			rsaBits: 2048,
			curve: 'curve25519',
			userIDs: [user],
			format: 'armored'
		})
		console.log('生成公私钥', keyPair)
		return keyPair
	} catch (error) {
		console.log('生成公私钥错误:', error)
		return null
	}
}

/**
 * 加密消息
 * @param {CryptoKey} publicKeyArmored 		共享密钥
 * @param {string} plaintext 			要加密的消息
 * @returns
 */
export async function encryptMessage(publicKeyArmored, plaintext) {
	try {
		const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored })
		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: plaintext }),
			publicKeys: publicKey
		})
		return encrypted
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
