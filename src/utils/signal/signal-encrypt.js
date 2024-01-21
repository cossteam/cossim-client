
import { Curve } from '@privacyresearch/curve25519-typescript'

/**
 * 非对称加密消息
 * @param {string} msg  要加密的消息
 * @param {SessionCipher} cipher
 * @returns
 */
export async function encrypt(msg, cipher) {
    // 把消息转为 ArrayBuffer
    const buffer = new TextEncoder().encode(msg).buffer

    // 加密
    const ciphertext = await cipher.encrypt(buffer)

    const result = {
        ...ciphertext,
        // 把消息转为 base64
        body: stringToBase64(ciphertext.body)
    }

    return result
}


// // 生成 Alice 的密钥对
// const aliceKeys = Curve.createKeyPair()
// // 生成 Bob 的密钥对
// const bobKeys = createKeyPair()
// // Alice计算共享密钥
// const aliceSharedKey = deriveSharedSecret(aliceKeys.secretKey, bobKeys.publicKey)
// // Bob计算共享密钥
// const bobSharedKey = deriveSharedSecret(bobKeys.secretKey, aliceKeys.publicKey)


/**
 * 对称加密消息 Curve
 * @param {string} msg  要加密的消息
 * @param {SessionCipher} cipher
 * @returns
 */
export async function encryptSymmetric(msg, key) {

}