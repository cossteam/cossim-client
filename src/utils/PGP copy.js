import * as openpgp from 'openpgp'

class PGP {
	constructor(passphrase) {
		if (!passphrase.trim()) {
			console.error('请输入有效密钥...')
			return
		}
		this.passphrase = passphrase
		if (!this.instance) {
			this.instance = this
		}
		return this.instance
	}
	// 生成密钥对
	generateKeys() {
		return new Promise(async (resolve, reject) => {
			try {
				const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
					type: 'rsa', // 密钥的类型，默认为ECC
					rsaBits: 2048, // RSA密钥大小（默认为4096位）
					curve: 'curve25519', // ECC曲线名称，默认为curve25519
					userIDs: [{ name: 'COSS', email: 'coss@cossim.com' }], // 可以传递多个用户ID
					passphrase: this.passphrase, // 密码短语
					format: 'armored' // 输出密钥格式，默认为“armored”（其他选项：“binary”或“object”）
				})
				this.publicKey = publicKey
				this.privateKey = privateKey

				this.publicKeyObj = await openpgp.readKey({ armoredKey: this.publicKey })
				this.privateKeyObj = await openpgp.decryptKey({
					privateKey: await openpgp.readPrivateKey({ armoredKey: this.privateKey }),
					passphrase: this.passphrase
				})
				// console.log(privateKey)
				// console.log(publicKey)
				// console.log(this.publicKeyObj)
				// console.log(this.privateKeyObj)
				resolve({ privateKey, publicKey, revocationCertificate })
			} catch (error) {
				console.error(error)
				reject(null)
			}
		})
	}
	// 加密
	encrypt(data) {
		return new Promise(async (resolve, reject) => {
			try {
				if (typeof data === 'string') {
					data = {
						text: data,
						key: this.publicKeyObj
					}
				} else if (typeof data === 'object') {
					const inputKey = data.key || data.publicKey
					const key = inputKey ? await openpgp.readKey({ armoredKey: inputKey }) : null
					data = {
						text: data.text || '',
						key: key || this.publicKeyObj
					}
				}
				const encrypted = await openpgp.encrypt({
					message: await openpgp.createMessage({
						text: data.text
					}),
					encryptionKeys: data.key
					// signingKeys: this.privateKeyObj // optional
				})
				resolve(encrypted)
			} catch (error) {
				console.error(error)
				reject(null)
			}
		})
	}
	// 解密
	decrypt(data) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log(typeof data)
				console.log(data)
				console.log(this.privateKeyObj)
				if (typeof data === 'string') {
					data = {
						text: data,
						key: this.privateKeyObj
					}
				} else if (typeof data === 'object') {
					// console.log(data.key)
					const inputKey = data.key || data.privateKey
					// console.log(inputKey)
					const key = inputKey ? await openpgp.readKey({ armoredKey: inputKey }) : null
					// console.log(key)
					data = {
						text: data.text || '',
						key: key || this.privateKeyObj
					}
				}
				const { data: decrypted } = await openpgp.decrypt({
					message: await openpgp.readMessage({
						armoredMessage: data.text
					}),
					// verificationKeys: this.publicKeyObj, // optional
					decryptionKeys: data.key
				})
				resolve(decrypted)
			} catch (error) {
				console.error(error)
				reject(null)
			}
		})
	}
	// AES256加密
	encryptAES256(data, key) {
		return new Promise(async (resolve, reject) => {
			try {
				const encrypted = await openpgp.encrypt({
					message: await openpgp.createMessage({ text: data }),
					passwords: key
				})
				resolve(encrypted)
			} catch (error) {
				console.error(error)
				reject(null)
			}
		})
	}
	// AES256解密
	decryptAES256(data, key) {
		return new Promise(async (resolve, reject) => {
			try {
				const { data: decrypted } = await openpgp.decrypt({
					message: await openpgp.readMessage({
						// binaryMessage: encrypted // parse encrypted bytes
						armoredMessage: data
					}),
					passwords: [key] // decrypt with password
					// format: 'binary' // output as Uint8Array
				})
				resolve(decrypted)
			} catch (error) {
				console.error(error)
				reject(null)
			}
		})
	}
}

/*
;(async () => {
	const myPGP = new PGP('COSS')
	// 生成客户端公私钥
	await myPGP.generateKeys()
	// AES256加密
	const passwords = ['对称加密密钥1']
	console.log(passwords)
	const encrypted = await myPGP.encryptAES256('明文内容', passwords[0])
	console.log(encrypted)
	// 加密密钥
	const passwordsEncrypted = await myPGP.encrypt(passwords[0])
	// 拼接消息
	const fromData = {
		message: encrypted,
		secret: passwordsEncrypted
	}
	// AES256解密
	const pwd = await myPGP.decrypt(fromData.secret)
	console.log(pwd)
	const decrypted = await myPGP.decryptAES256(fromData.message, pwd)
	console.log('解密后的明文', decrypted)
})()
 */

export default new PGP('COSS')

console.log('PGP Ready...')
