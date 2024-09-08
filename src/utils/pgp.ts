// import * as openpgp from 'openpgp'
import {
    WebStream,
    createMessage,
    decrypt,
    decryptKey,
    encrypt,
    generateKey,
    readKey,
    readMessage,
    readPrivateKey
} from 'openpgp'

export default class PGPUtils {
    /**
     *
     * @param {*} name
     * @param {*} email
     * @param {*} passphrase
     * @returns
     */
    static async generateKeyPair(name: string, email: string, passphrase: string): Promise<any> {
        if (!name || !email || !passphrase) {
            console.error('请输入姓名、电子邮件和密码')
            return null
        }
        try {
            const { privateKey, publicKey, revocationCertificate } = await generateKey({
                type: 'rsa', // 密钥的类型，默认为ECC
                rsaBits: 2048, // RSA密钥大小（默认为4096位）
                curve: 'curve25519', // ECC曲线名称，默认为curve25519
                userIDs: [{ name, email }], // 可以传递多个用户ID
                passphrase, // 密码短语
                format: 'armored' // 输出密钥格式，默认为“armored”（其他选项：“binary”或“object”）
            })
            return { privateKey, publicKey, revocationCertificate }
        } catch (error) {
            console.log(error)
            return null
        }
    }
    /**
     *
     * @param {*} publicKeyArmored
     * @param {*} message
     * @returns
     */
    static async rsaEncrypt(publicKeyArmored: string, message: string | object) {
        try {
            if (typeof message === 'object') message = JSON.stringify(message)
            const publicKey = await readKey({ armoredKey: publicKeyArmored })

            const encrypted = await encrypt({
                message: await createMessage({
                    text: message
                }),
                encryptionKeys: [publicKey]
            })
            return encrypted
        } catch (error) {
            console.log(error)
            return null
        }
    }
    /**
     *
     * @param {*} privateKeyArmored
     * @param {*} passphrase
     * @param {*} encryptedMessage
     * @returns
     */
    static async rsaDecrypt(privateKeyArmored: string, passphrase: string, encryptedMessage: any) {
        try {
            const _readPrivateKey = await readPrivateKey({ armoredKey: privateKeyArmored })
            const privateKey = await decryptKey({
                privateKey: _readPrivateKey,
                passphrase
            })

            const message = await readMessage({
                armoredMessage: encryptedMessage
            })
            const decrypted = await decrypt({
                message,
                decryptionKeys: [privateKey]
            })
            try {
                return JSON.parse(decrypted.data.toString())
            } catch (error) {
                console.log(error)
                return decrypted.data
            }
        } catch (error) {
            console.error('解密失败', error)
            return null
        }
    }
    /**
     *
     * @param {*} data
     * @param {*} key
     * @returns
     */
    static async aes256Encrypt(
        data: object | string,
        key: string
    ): Promise<WebStream<string> | null> {
        try {
            if (typeof data === 'object') data = JSON.stringify(data)
            const encrypted = await encrypt({
                message: await createMessage({
                    text: data
                }),
                passwords: [key]
            })
            return encrypted
        } catch (error) {
            console.log(error)
            return null
        }
    }
    /**
     *
     * @param {*} data
     * @param {*} key
     * @returns
     */
    static async aes256Decrypt(data: any, key: string) {
        try {
            const { data: decrypted } = await decrypt({
                message: await readMessage({
                    armoredMessage: data
                }),
                passwords: [key]
            })
            try {
                return JSON.parse(decrypted.toString())
            } catch (error) {
                console.log(error)
                return decrypted
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

/*
// 测试
;(async () => {
	const name = 'COSS'
	const email = 'coss@cossim.com'
	const passphrase = 'cossim'
	// RSA
	const { privateKey, publicKey } = await PGPUtils.generateKeyPair(name, email, passphrase)
	const encrypted = await PGPUtils.rsaEncrypt(publicKey, {
		name,
		email
	})
	console.log(encrypted)
	const decrypted = await PGPUtils.rsaDecrypt(privateKey, passphrase, encrypted)
	console.log(decrypted)
	// AES256
	const encryptedAES256 = await PGPUtils.aes256Encrypt(
		{
			name,
			email
		},
		passphrase
	)
	console.log(encryptedAES256)
	const decryptedAES256 = await PGPUtils.aes256Decrypt(encryptedAES256, passphrase)
	console.log(decryptedAES256)
})()
*/

console.log('PGP Ready...')
