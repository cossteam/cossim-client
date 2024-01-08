import * as openpgp from 'openpgp'

class PGP {
	constructor(passphrase) {
        if (!passphrase.trim()) {
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
	encrypt(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof data === 'string') {
                    data = {
                        text: data,
                        key: this.publicKeyObj
                    }
                } else if (typeof data === 'object') {
                    const inputKey = (data.key || data.publicKey)
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
                    encryptionKeys: data.key,
                    // signingKeys: this.privateKeyObj // optional
                })
                resolve(encrypted)
            } catch (error) {
                console.error(error);
                reject(null)
            }
        })
	}
	// 解密
	decrypt(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof data === 'string') {
                    data = {
                        text: data,
                        key: this.privateKeyObj
                    }
                } else if (typeof data === 'object') {
                    data = {
                        text: data.text || '',
                        key: data.key || data.privateKey || this.privateKeyObj
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
                console.error(error);
                reject(null)
            }
        })
	}
}

;(async () => {
	const myPGP = new PGP('COSS')
	await myPGP.generateKeys()
	const e = await myPGP.encrypt({ text: JSON.stringify({ msg: 'hello world' }) })
	console.log(e)
	const d = await myPGP.decrypt(e)
	console.log(JSON.parse(d))
})()

/*
;(async () => {
	const myPGP = new PGP('COSS')
	// await myPGP.generateKeys()
    const key = `-----BEGIN PGP PUBLIC KEY BLOCK-----
    Version: GopenPGP 2.7.4
    Comment: https://gopenpgp.org
    
    xsBNBGWb6dIBCADVkXcVcDquS/+RNOw6EfstfvPSJTMNk1wQX1QxoBgKpPsuSwl8
    YecYyKxdSehEiCBpB6iBCCrI4sbWUofrrXAhRX7cXo960a8ztkfsDN3+oke1SRr3
    HB6Sby536GjaoIG2dCHctwS+q8VDiHjbCVJKxFe0OEV1ONV4A12qFku+lyCY2+lr
    45roxIYpB47fDopb6BnQdwvp+1jGxtPdEEJKUCvSlEGZemBqhNjIdHuy06DDon8S
    lPWmD2vpLqOaOaaOLLbz4rn6iEW4XQV9az7AXyN2BHkVHnXd2TDwH535WGlzbW87
    +5feJlPGZC55WdPCoH8ylfM+9YqD+AMju1ALABEBAAHNJGNvc3MtaW0gPG1heC5t
    dXN0ZXJtYW5uQGV4YW1wbGUuY29tPsLAjQQTAQgAQQUCZZvp0gkQoTq7LN9x2E0W
    IQSyIAkxQRbZjH1qouChOrss33HYTQIbAwIeAQIZAQMLCQcCFQgDFgACBScJAgcC
    AAAMgwgAzgVtqxtrKdzL/VxQHJRMInGk4xPfpfAR406nXSX/y324ZsLmAR01i/x1
    /Q8+15tK5y6GHXUc4F80pWsWefYTmqtrbLHXW9m+Akd0ICsvEgvn8a4/wuWZCMEC
    Qq8Wfikb/HNVCrUROXaUP+QG1x/uL8HWpt76cqqUY5cE4l7GbkEoZHPBOtQKIMdI
    ukorFVm6To5Bge3ReV7n/tnsRzuOjJJrqiTQjRUmVpSlcCKeaVVHI4dEHWJElTq1
    KRLt64G9vL2xsF7fL8fw6qyA5mEjXzjCNQUi8sVwsMWwj/Eo+DWSerM17IsLP+g1
    n3r7p0RSDMOuxs7iWzd+fHYIQua5fc7ATQRlm+nSAQgAtRjNi5bLoMlFHe8c9ZCQ
    yMgEOGcFnYDNiR1NsQL2rQevRXqiy4tO/pCYq7P9n8m9z6T0Vb37WTztCtivbHKa
    /BRWU9XOqeD2YjVEy+SUXnYx4WN0jk/J5MvGYUCE7Bf3VZdaWY32YDxj9K60mez4
    1vO24IjD0vh7xdfbm8MKtIJ8E/l6nhKt2YVHwSJt/XddaL2c0lu7r3oHUGFlQtiH
    YrSDCJR6Vvglvsg+8JdRYTJgxqcwbNuGAGv2n0n1mUhmR6yFmi2nSm1uB7cRqQGG
    qqiYrBPYUs4IVFquMHu69/XLTJcduNIz1jISmXWdcstNAeiPVEdy7OhNdXlidAyN
    8wARAQABwsB2BBgBCAAqBQJlm+nSCRChOrss33HYTRYhBLIgCTFBFtmMfWqi4KE6
    uyzfcdhNAhsMAAA2tggAwGGYI54PRyEEjuA5rI1l6bZcdFhoGc9L5vWB10+MAKUw
    JwuMmfQBmtk9xUjYNPGUDUYdaCjyH/Kdf+XUxVZyaC1fZ8dEald1iCundKJhPGP4
    7CXj2FrVUNpkRL9+y1Ou9H557P3zsds+f6mNZJ352+T3n1MCX/d2mmCB7t8wGhnM
    aLvLF5tXLk/xIn97GvX0ItQYiWkXm/oivQY5XX6rUF5OQ923pyouJZsCvDMM8ZMu
    AyWIiKh+JZSCty1ss5OZ/MjKu2Mi24mKigLIhwpT6nKnGD2byfwYwpJxjzyX/eQI
    Wj3xrA4THbVeaQPUeOnVYkKRcZOJSq39RK04g/QLAA==
    =otyk
    -----END PGP PUBLIC KEY BLOCK-----`
	const e = await myPGP.encrypt({text: 'hello world', key})
	console.log(e)
// 	const d = await myPGP.decrypt(e)
// 	console.log(d)
})()
*/

export default new PGP('COSS')

console.log('PGP Ready...')
