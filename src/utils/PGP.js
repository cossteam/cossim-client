import * as openpgp from 'openpgp'

async function generateKeys() {
	const passphrase = 'super long and hard to guess secret' //
	// 生成公私钥
	const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
		type: 'rsa', // Type of the key, defaults to ECC
		rsaBits: 2048, // RSA key size (defaults to 4096 bits)
		curve: 'curve25519', // ECC curve name, defaults to curve25519
		userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
		passphrase, // protects the private key
		format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
	})
	console.log('公钥：', publicKey)
	console.log('私钥：', privateKey)
	const publicKey2 = await openpgp.readKey({ armoredKey: publicKey })
	const privateKey2 = await openpgp.decryptKey({
		privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
		passphrase
	})
	// 加密
	const encrypted = await openpgp.encrypt({
		message: await openpgp.createMessage({
			text: 'Hello, World!'
		}),
		encryptionKeys: publicKey2,
		signingKeys: privateKey2 // optional
	})
	console.log('加密后的消息：', encrypted)
	// 解密
	const { data: decrypted } = await openpgp.decrypt({
		message: await openpgp.readMessage({
			armoredMessage: encrypted
		}),
		verificationKeys: publicKey2, // optional
		decryptionKeys: privateKey2
	})
	console.log('解密后的消息：', decrypted) // 'Hello, World!'
	console.log(revocationCertificate) // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
}
// console.log('生成公私钥')
// generateKeys()

class PGP {
	constructor(passphrase) {
		this.passphrase = passphrase
		if (!PGP.instance) {
			PGP.instance = this
		}
		return PGP.instance
	}
	// 生成密钥对
	async generateKeys() {
		const { privateKey, publicKey /* revocationCertificate */ } = await openpgp.generateKey({
			type: 'rsa', // Type of the key, defaults to ECC
			rsaBits: 2048, // RSA key size (defaults to 4096 bits)
			curve: 'curve25519', // ECC curve name, defaults to curve25519
			userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
			passphrase: this.passphrase, // protects the private key
			format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
		})

		this.publicKey = publicKey
		this.privateKey = privateKey

		console.log('公钥1：', this.publicKey)
		console.log('私钥1：', this.privateKey)

		const publicKeyObj = await openpgp.readKey({ armoredKey: this.publicKey })
		console.log(123)
		const readPrivateKey = await openpgp.readPrivateKey({ armoredKey: this.privateKey })
		console.log(456)
		const privateKeyObj = await openpgp.decryptKey({
			privateKey: readPrivateKey,
			passphrase: this.passphrase
		})
		console.log(789)

		this.publicKeyObj = publicKeyObj
		this.privateKeyObj = privateKeyObj

		console.log('公钥2：', this.publicKeyObj)
		console.log('私钥2：', this.privateKeyObj)

		// console.log(revocationCertificate)
	}
	// 加密
	async encrypt(text) {
		const encrypted = await openpgp.encrypt({
			message: await openpgp.createMessage({
				text
			}),
			encryptionKeys: this.publicKeyObj,
			signingKeys: this.privateKeyObj // optional
		})
		return encrypted
	}
	// 解密
	async decrypt(encrypted) {
		const { data: decrypted } = await openpgp.decrypt({
			message: await openpgp.readMessage({
				armoredMessage: encrypted
			}),
			verificationKeys: this.publicKeyObj, // optional
			decryptionKeys: this.privateKeyObj
		})
		return decrypted
	}
}

;(async () => {
	const myPGP = new PGP()
	await myPGP.generateKeys()
	const e = await myPGP.encrypt('hello world')
	console.log(e)
	// const d = await myPGP.decrypt(e)
	// console.log(d)
})()

export default new PGP()

console.log('PGP Ready...')
