import {
	KeyHelper,
	SignedPublicPreKeyType,
	SignalProtocolAddress,
	SessionBuilder,
	PreKeyType,
	SessionCipher,
	MessageType,
	DeviceType
} from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from './storage-type'
import { cloneDeep } from 'lodash-es'
import { SignalDirectory } from './signal-directory'

export default class Signal {
	public directory: SignalDirectory = new SignalDirectory()

	// todo: 后续仓库可能需要修改，在添加时可以添加到 indexDB 中, 或者初始化的时候读取数据到仓库中
	public store: SignalProtocolStore = new SignalProtocolStore()

	/**
	 * 创建身份
	 * @param {string} name     这个用于标识 directory 的 key 值，建议用用户 id 或者 一个唯一的值
	 * @returns
	 */
	async ceeateIdentity(name: string) {
		// 生成一个注册id
		const registrationId = KeyHelper.generateRegistrationId()

		// 生成身份密钥对
		const identityKeyPair = await KeyHelper.generateIdentityKeyPair()

		// 生成一个预共享密钥
		const baseKeyId = Math.floor(10000 * Math.random())

		// 存储预密钥
		const preKey = await KeyHelper.generatePreKey(baseKeyId)

		// 随机生成一个签名密钥 id
		const signedPreKeyId = Math.floor(10000 * Math.random())

		// 生成签名密钥
		const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)

		// 公共签名预密钥
		const publicSignedPreKey: SignedPublicPreKeyType = {
			keyId: signedPreKeyId,
			publicKey: signedPreKey.keyPair.pubKey,
			signature: signedPreKey.signature
		}

		// 公共预密钥
		const publicPreKey: PreKeyType = {
			keyId: preKey.keyId,
			publicKey: preKey.keyPair.pubKey
		}

		// 存储注册id 1129
		this.store.put(`registrationID`, registrationId)
		// 存储身份密钥
		this.store.put(`identityKey`, identityKeyPair)
		// 存储预密钥
		this.store.storePreKey(`${baseKeyId}`, preKey.keyPair)
		// 存储签名密钥
		this.store.storeSignedPreKey(`${signedPreKeyId}`, signedPreKey.keyPair)

		this.directory.storeKeyBundle(name, {
			registrationId,
			identityPubKey: identityKeyPair.pubKey,
			signedPreKey: publicSignedPreKey,
			oneTimePreKeys: [publicPreKey]
		})

		const buffer = {
			registrationId,
			identityKeyPair,
			publicPreKey,
			publicSignedPreKey,
			signedPreKeyId
		}

		return {
			buffer,
			base64: toBase64(buffer)
		}
	}

	/**
	 * 创建会话
	 * @returns {Promise<IdentityType>}
	 */
	async cretaeSession(userStore: SignalProtocolStore, recipientAddress: SignalProtocolAddress, bundle: DeviceType) {
		const sessionBuilder = new SessionBuilder(userStore, recipientAddress)
		await sessionBuilder.processPreKey(bundle)
	}

	/**
	 * 加密消息
	 * @param {string} msg  要加密的消息
	 * @param {SessionCipher} cipher
	 * @returns
	 */
	async encrypt(msg: string, cipher: SessionCipher) {
		// 把消息转为 ArrayBuffer
		const buffer = new TextEncoder().encode(msg).buffer

		// 加密
		const ciphertext = await cipher.encrypt(buffer)

		const result = {
			...ciphertext,
			// 把消息转为 base64
			body: stringToBase64(ciphertext.body!)
		}

		return result
	}

	/**
	 * 解密消息
	 * @param {MessageType} msg  要解密的消息
	 * @param {SessionCipher} cipher
	 * @returns {SessionCipher}
	 */
	async decrypt(msg: MessageType, cipher: SessionCipher) {
		let plaintext: ArrayBuffer = new Uint8Array().buffer

		if (msg.type === 3) {
			plaintext = await cipher.decryptPreKeyWhisperMessage(base64ToString(msg.body!), 'binary')
		} else if (msg.type === 1) {
			plaintext = await cipher.decryptWhisperMessage(base64ToString(msg.body!), 'binary')
		}
		const stringPlaintext = new TextDecoder().decode(new Uint8Array(plaintext))

		return stringPlaintext
	}
}

/**
 * ArrayBuffer 转 base64
 * @param {ArrayBuffer} arr
 * @returns {string}
 */
export function arrayBufferToBase64(arr: ArrayBuffer) {
	let binary = ''
	const bytes = new Uint8Array(arr)
	const len = bytes.byteLength

	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	return btoa(binary)
}

/**
 * base64 转 ArrayBuffer
 * @param str
 * @returns
 */
export function base64ArrayBuffer(str: string) {
	// 使用atob将Base64字符串转换为二进制字符串
	const binaryString = atob(str)

	// 创建一个Uint8Array视图
	const uint8Array = new Uint8Array(binaryString.length)

	// 将二进制字符串的每个字符转换为Uint8Array的元素
	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i)
	}

	// 现在，uint8Array是包含解码后数据的Uint8Array
	const buffer = uint8Array.buffer

	return buffer
}

/**
 * 把对象中的 ArrayBuffer 转 base64
 * @returns {Promise<IdentityType>}
 */
export function toBase64(obj: any, isClone: boolean = true) {
	const clone = isClone ? cloneDeep(obj) : obj
	Object.keys(clone).forEach(async (key) => {
		if (clone[key] instanceof ArrayBuffer) {
			clone[key] = arrayBufferToBase64(clone[key])
		}
		if (typeof clone[key] === 'object') {
			toBase64(clone[key], false)
		}
	})
	return clone
}

/**
 * 把对象中的 base64 转 ArrayBuffer(33)
 * @returns {Promise<ArrayBuffer>}
 */
export function toArrayBuffer(obj: any, isClone: boolean = true) {
	const clone = isClone ? cloneDeep(obj) : obj
	Object.keys(clone).forEach(async (key) => {
		// 判断是否是 base64 字符
		if (typeof clone[key] === 'string') {
			clone[key] = base64ArrayBuffer(clone[key])
		}

		if (typeof clone[key] === 'object') {
			toArrayBuffer(clone[key], false)
		}
	})

	return clone
}

/**
 * 字符串转 base 64
 * @returns {Promise<ArrayBuffer>}
 */
export function stringToBase64(str: string) {
	return arrayBufferToBase64(new TextEncoder().encode(str).buffer)
}

/**
 * base64 转字符串
 * @returns {Promise<ArrayBuffer>}
 */
export function base64ToString(str: string) {
	return new TextDecoder().decode(base64ArrayBuffer(str))
}
