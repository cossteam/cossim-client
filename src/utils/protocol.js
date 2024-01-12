import { KeyHelper, SignalProtocolAddress, SessionBuilder } from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from './storage-type'
// import { SignalDirectory } from "./utils/signal-directory" 

const directory = new SignalProtocolAddress()

/**
 * 创建身份
 * @param {string} name - 身份名称
 * @param {string} identifier - 身份标识符
 * @param {string} deviceId - 设备ID
 * @param {object} directory - 目录
 * @returns {object} - 包含publicPreKey、directory、store和address的对象
 */
export async function createIdentity(name, identifier, deviceId, directory = directory) {
	const address = new SignalProtocolAddress(identifier, deviceId)
	const store = new SignalProtocolStore()

	// 生成一个注册id
	const registrationId = KeyHelper.generateRegistrationId()

	// 存储注册id
	store.put(`registrationID`, registrationId)

	// 生成身份密钥对
	const identityKeyPair = await KeyHelper.generateIdentityKeyPair()

	// 存储身份密钥
	store.put(`identityKey`, identityKeyPair)

	// 生成一个预共享密钥
	const baseKeyId = Math.floor(10000 * Math.random())

	// 存储预密钥
	const preKey = await KeyHelper.generatePreKey(baseKeyId)

	// 存储预密钥
	store.storePreKey(`${baseKeyId}`, preKey.keyPair)

	// 随机生成一个签名密钥 id
	const signedPreKeyId = Math.floor(10000 * Math.random())

	// 生成签名密钥
	const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)

	store.storeSignedPreKey(`${signedPreKeyId}`, signedPreKey.keyPair)

	const publicSignedPreKey = {
		keyId: signedPreKeyId,
		publicKey: signedPreKey.keyPair.pubKey,
		signature: signedPreKey.signature
	}

	// 现在我们将其注册到服务器，以便所有用户都可以看到它们
	const publicPreKey = {
		keyId: preKey.keyId,
		publicKey: preKey.keyPair.pubKey
	}

	directory.storeKeyBundle(name, {
		registrationId,
		identityPubKey: identityKeyPair.pubKey,
		signedPreKey: publicSignedPreKey,
		oneTimePreKeys: [publicPreKey]
	})

	return {
		publicPreKey,
		directory,
		store,
		address,
        public: directory.getPreKeyBundle(address.name)
	}
}

/**
 * 创建会话
 * @param {string} user1    发送方
 * @param {string} user2
 */
export async function createSession(userStore, targetAddress, bundle) {

	// 生成会话 接收放的 name
	// const bundle = directory.getPreKeyBundle(targetAddress.name)

	// 生成地址
	const address = new SignalProtocolAddress(targetAddress.name, targetAddress.deviceId)

	// 生成会话
	// const recipientAddress = address

	// 为远程recipientId + deviceId元组实例化SessionBuilder。 发送方地址，接收放地址
	const sessionBuilder = new SessionBuilder(userStore.store, address)

	// 处理从服务器获取的预密钥
	await sessionBuilder.processPreKey(bundle)
}

/**
 * 发送消息
 * @param {*} msg
 * @param {*} cipher
 * @returns
 */
export async function encryptMessage(msg, cipher) {
	// 把消息转为 ArrayBuffer
	const encoder = new TextEncoder()
	const buffer = encoder.encode(msg).buffer

	// 加密
	const ciphertext = await cipher.encrypt(buffer)

	const data = {
		...ciphertext,
		body: btoa(ciphertext.body)
	}

	console.log('发送消息', data)

	return data
}
