import { KeyHelper, SessionBuilder, SignalProtocolAddress, SessionCipher } from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from './storage-type'
import { cloneDeep } from 'lodash-es'
import { SignalDirectory } from './signal-directory'
import { dbService } from '@/db'

export default class Signal {
	directory = new SignalDirectory()

	// todo: 后续仓库可能需要修改，在添加时可以添加到 indexDB 中, 或者初始化的时候读取数据到仓库中
	store = new SignalProtocolStore()

	// 地址
	address = null

	// 设备名
	deviceName = ''

	// 设备 ID
	deviceId = 0

	/**
	 * 实例化
	 * @param {*} name 			名称
	 * @param {*} deviceId 		设备id
	 */
	constructor(name, deviceId) {
		this.deviceName = name
		this.deviceId = deviceId
		this.address = new SignalProtocolAddress(name, deviceId)
	}

	/**
	 * 创建身份
	 * @param {string} name     这个用于标识 directory 的 key 值，建议用用户 id 或者 一个唯一的值
	 * @returns
	 */
	async ceeateIdentity(name) {
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
		const publicSignedPreKey = {
			keyId: signedPreKeyId,
			publicKey: signedPreKey.keyPair.pubKey,
			signature: signedPreKey.signature
		}

		// 公共预密钥
		const publicPreKey = {
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

		this.directory.storeKeyBundle(
			name,
			toBase64({
				registrationId,
				identityPubKey: identityKeyPair.pubKey,
				signedPreKey: publicSignedPreKey,
				oneTimePreKeys: [publicPreKey]
			})
		)

		this.store._store = toBase64(this.store._store)

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
	async cretaeSession(userStore, recipientAddress, bundle) {
		const sessionBuilder = new SessionBuilder(userStore, recipientAddress)
		await sessionBuilder.processPreKey(bundle)
	}

	/**
	 * 加密消息
	 * @param {string} msg  要加密的消息
	 * @param {SessionCipher} cipher
	 * @returns
	 */
	async encrypt(msg, cipher) {
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

	/**
	 * 解密消息
	 * @param {MessageType} msg  要解密的消息
	 * @param {SessionCipher} cipher
	 * @returns {SessionCipher}
	 */
	async decrypt(msg, cipher) {
		let plaintext = new Uint8Array().buffer

		if (msg.type === 3) {
			plaintext = await cipher.decryptPreKeyWhisperMessage(base64ToString(msg.body), 'binary')
			// await cipher.decryptPreKeyWhisperMessage(base64ToString(msg.body), 'binary')
		} else if (msg.type === 1) {
			plaintext = await cipher.decryptWhisperMessage(base64ToString(msg.body), 'binary')
			// await cipher.decryptWhisperMessage(base64ToString(msg.body), 'binary')
		}
		const stringPlaintext = new TextDecoder().decode(new Uint8Array(plaintext))

		return stringPlaintext
	}

	/**
	 * 恢复会话
	 * @param {IdentityType} identity
	 * @returns
	 */
	async restoreSession(identity) {
		const bundle = await this.directory.getKeyBundle(identity.name)
		const sessionBuilder = new SessionBuilder(this.store, identity.address)
		await sessionBuilder.processPreKey(bundle)
	}
}

/**
 * 创建会话
 * @returns {Promise<IdentityType>}
 */
export async function cretaeSession(userStore, recipientAddress, bundle) {
	const sessionBuilder = new SessionBuilder(userStore, recipientAddress)
	return await sessionBuilder.processPreKey(bundle)
}

/**
 * 加密消息
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

/**
 * 解密消息
 * @param {MessageType} msg  要解密的消息
 * @param {SessionCipher} cipher
 * @returns {SessionCipher}
 */
export async function decrypt(msg, cipher) {
	let plaintext = new Uint8Array().buffer

	if (msg.type === 3) {
		plaintext = await cipher.decryptPreKeyWhisperMessage(base64ToString(msg.body), 'binary')
	} else if (msg.type === 1) {
		plaintext = await cipher.decryptWhisperMessage(base64ToString(msg.body), 'binary')
	}
	const stringPlaintext = new TextDecoder().decode(new Uint8Array(plaintext))

	return stringPlaintext
}

/**
 * ArrayBuffer 转 base64
 * @param {ArrayBuffer} arr
 * @returns {string}
 */
export function arrayBufferToBase64(arr) {
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
export function base64ArrayBuffer(str) {
	// console.log("base64 转 ArrayBuffer", str)
	// 如果不是 base64 字符串，则转换为 base64
	if (str.length % 4 !== 0) {
		str += '='.repeat(4 - (str.length % 4))
	}
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
export function toBase64(obj, isClone = true) {
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
export function toArrayBuffer(obj, isClone = true) {
	const clone = isClone ? cloneDeep(obj) : obj
	Object.keys(clone).forEach(async (key) => {
		// 判断是否是 base64 字符
		if (typeof clone[key] === 'string' && isBase64(clone[key])) {
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
export function stringToBase64(str) {
	return arrayBufferToBase64(new TextEncoder().encode(str).buffer)
}

/**
 * base64 转字符串
 * @returns {Promise<ArrayBuffer>}
 */
export function base64ToString(str) {
	return new TextDecoder().decode(base64ArrayBuffer(str))
}

function isBase64(str) {
	// 使用正则表达式检查字符串是否符合Base64编码格式
	const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/
	return base64Regex.test(str)
}

/**
 * 重连会话
 *
 * @param {type} user_id -用户 ID
 * @return {type} 会话
 */
export async function reconnectSession(friend_id, user_id, self = false) {
	try {
		// 获取对方信息
		const reslut = await dbService.findOneById(dbService.TABLES.SESSION, friend_id)
		// 查找自己信息
		const user = await dbService.findOneById(dbService.TABLES.USERS, user_id)

		console.log('查找对方会话信息', reslut, user)

		// 如果没有找到对方会话
		if (!reslut) {
			// TODO: 通知对方发送公钥
			console.error('TODO:没有找到对方的会话信息，通知对方发送公钥')
			return
		}

		if (self) {
			// 如果是自己
			// const store = new SignalProtocolStore(toArrayBuffer(reslut.data?.store))
			// const address = new SignalProtocolAddress(
			// 	user.data?.signal?.address?._name,
			// 	user.data?.signal?.address?._deviceId
			// )

			// const cipher = new SessionCipher(store, address)

			// // const seion = await cretaeSession(store, address,toArrayBuffer(reslut.data?.directory))

			// // console.log('重连会话成功', cipher,address,seion)

			// return cipher
		}

		// 自己仓库
		const store = new SignalProtocolStore(toArrayBuffer(reslut.data?.store))
		// 初始化对方地址
		const addr = new SignalProtocolAddress(reslut.data?.directory.deviceName, reslut.data?.directory.deviceId)
		// 初始化会话
		const cipher = new SessionCipher(store, addr)

		console.log('重连会话成功', cipher)

		// 返回会话
		return cipher
	} catch (error) {
		console.log('重连会话失败', error)
		return null
	}
}
