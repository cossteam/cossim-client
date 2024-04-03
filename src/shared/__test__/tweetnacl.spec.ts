import { generateKeyPair, performKeyExchange, cretateNonce, encryptMessage, decryptMessage } from '@/shared/tweetnacl'
import { describe, it, expect } from 'vitest'

describe('tweetnacl', () => {
	it('test tweetnacl', () => {
		// 生成公私钥
		const aliceKeyPair = generateKeyPair()
		const bobKeyPair = generateKeyPair()

		// 交换密钥
		const sharedSecret1 = performKeyExchange(aliceKeyPair.privateKey, bobKeyPair.publicKey)
		const sharedSecret2 = performKeyExchange(bobKeyPair.privateKey, aliceKeyPair.publicKey)

		expect(sharedSecret1).toBeInstanceOf(Uint8Array)
		expect(sharedSecret2).toBeInstanceOf(Uint8Array)

		const nonce = cretateNonce()
		const message = 'Hello, Bob!'

		const encryptedMessage = encryptMessage(message, nonce, sharedSecret1)

		console.log('encryptedMessage 加密消息', encryptedMessage)

		// const msg = { msg: encryptedMessage, nonce: nonce }

		// console.log('encryptedMessage', msg, encryptedMessage)

		// const decryptedMessage = decryptMessage(msg.msg, msg.nonce, sharedSecret2)
		// console.log('decryptedMessage', decryptedMessage)
	})
})
