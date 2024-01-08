import * as openpgp from 'openpgp'

class PGP {
	constructor(passphrase) {
        if (!passphrase) {
            console.error("请输入有效密钥...");
            return
        }
		this.passphrase = passphrase
		if (!PGP.instance) {
			PGP.instance = this
		}
		return PGP.instance
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
                    passphrase: this.passphrase, // 密钥的密码
                    format: 'armored' // 输出密钥格式，默认为“armored”（其他选项：“binary”或“object”）
                })
                this.publicKey = publicKey
                this.privateKey = privateKey
        
                this.publicKeyObj = await openpgp.readKey({ armoredKey: this.publicKey })
                this.privateKeyObj = await openpgp.decryptKey({
                    privateKey: await openpgp.readPrivateKey({ armoredKey: this.privateKey }),
                    passphrase: this.passphrase
                })
                resolve({ privateKey, publicKey, revocationCertificate })
            } catch (error) {
                console.error(error);
                reject(null)
            }
        })
	}
	// 加密
	async encrypt({text}) {
        return new Promise(async (resolve, reject) => {
            try {
                const encrypted = await openpgp.encrypt({
                    message: await openpgp.createMessage({
                        text
                    }),
                    encryptionKeys: this.publicKeyObj,
                    signingKeys: this.privateKeyObj // optional
                })
                resolve(encrypted)
            } catch (error) {
                console.error(error);
                reject(null)
            }
        })
	}
	// 解密
	async decrypt(encrypted) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data: decrypted } = await openpgp.decrypt({
                    message: await openpgp.readMessage({
                        armoredMessage: encrypted
                    }),
                    verificationKeys: this.publicKeyObj, // optional
                    decryptionKeys: this.privateKeyObj
                })
                resolve(decrypted)
            } catch (error) {
                console.error(error);
                reject(null)
            }
        })
	}
}

// ;(async () => {
// 	const myPGP = new PGP('COSS')
// 	await myPGP.generateKeys()
// 	const e = await myPGP.encrypt('hello world')
// 	console.log(e)
// 	const d = await myPGP.decrypt(e)
// 	console.log(d)
// })()

export default new PGP('COSS')

console.log('PGP Ready...')
