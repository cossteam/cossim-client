import * as openpgp from 'openpgp'

export default class PGPUtils {
	/**
	 *
	 * @param {*} name
	 * @param {*} email
	 * @param {*} passphrase
	 * @returns
	 */
	static async generateKeyPair(name, email, passphrase) {
		const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
			type: 'rsa', // 密钥的类型，默认为ECC
			rsaBits: 2048, // RSA密钥大小（默认为4096位）
			curve: 'curve25519', // ECC曲线名称，默认为curve25519
			userIDs: [{ name, email }], // 可以传递多个用户ID
			passphrase, // 密码短语
			format: 'armored' // 输出密钥格式，默认为“armored”（其他选项：“binary”或“object”）
		})
		// 子密钥
		const readPrivateKey = await openpgp.readPrivateKey({ armoredKey: privateKey })
		console.log(readPrivateKey)
		const privateKeyObj = await openpgp.decryptKey({
			privateKey: readPrivateKey,
			passphrase: this.passphrase
		})
		const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey })
		return { privateKey, publicKey, privateKeyObj, publicKeyObj, revocationCertificate }
	}
	/**
	 *
	 * @param {*} publicKeyArmored
	 * @param {*} message
	 * @returns
	 */
	static async rsaEncrypt(publicKeyArmored, message) {
		try {
			if (typeof message === 'object') message = JSON.stringify(message)
		} catch (error) {
			console.log(error)
		}
		const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored })

		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({
				text: message
			}),
			encryptionKeys: [publicKey]
		})
		return encrypted
	}
	/**
	 *
	 * @param {*} privateKeyArmored
	 * @param {*} passphrase
	 * @param {*} encryptedMessage
	 * @returns
	 */
	static async rsaDecrypt(privateKeyArmored, passphrase, encryptedMessage) {
		try {
			const readPrivateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored })
			const privateKey = await openpgp.decryptKey({
				privateKey: readPrivateKey,
				passphrase
			})

			const message = await openpgp.readMessage({
				armoredMessage: encryptedMessage
			})
			const decrypted = await openpgp.decrypt({
				message,
				decryptionKeys: [privateKey]
			})
			return JSON.parse(decrypted.data)
		} catch (error) {
			console.error('解密失败', error)
			return encryptedMessage
		}
	}
	/**
	 *
	 * @param {*} data
	 * @param {*} key
	 * @returns
	 */
	static async aes256Encrypt(data, key) {
		try {
			if (typeof data === 'object') data = JSON.stringify(data)
		} catch (error) {
			console.log(error)
		}
		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({
				text: data
			}),
			passwords: [key]
		})
		return encrypted
	}
	/**
	 *
	 * @param {*} data
	 * @param {*} key
	 * @returns
	 */
	static async aes256Decrypt(data, key) {
		const { data: decrypted } = await openpgp.decrypt({
			message: await openpgp.readMessage({
				armoredMessage: data
			}),
			passwords: [key]
		})
		try {
			return JSON.parse(decrypted)
		} catch (error) {
			console.log(error)
			return decrypted
		}
	}
}

;(async () => {
	// const name = 'COSS'
	// const email = 'coss@cossim.com'
	// const passphrase = 'cossim'
	// RSA
	// const { privateKey, publicKey } = await PGPUtils.generateKeyPair(name, email, passphrase)
	// const encrypted = await PGPUtils.rsaEncrypt(publicKey, {
	// 	name,
	// 	email
	// })
	// console.log(encrypted)
	// const decrypted = await PGPUtils.rsaDecrypt(privateKey, passphrase, encrypted)
	// console.log(decrypted)
	// AES256
	// const encryptedAES256 = await PGPUtils.aes256Encrypt(
	// 	{
	// 		name,
	// 		email
	// 	},
	// 	passphrase
	// )
	// console.log(encryptedAES256)
	// const decryptedAES256 = await PGPUtils.aes256Decrypt(encryptedAES256, passphrase)
	// console.log(decryptedAES256)
})()

console.log('PGP Ready...')
