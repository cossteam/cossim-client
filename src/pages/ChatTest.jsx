import React, { useState, useEffect } from 'react'
import { Page } from 'framework7-react'

import {
	KeyHelper,
	SignalProtocolAddress,
	SessionBuilder,
	SessionCipher
} from '@privacyresearch/libsignal-protocol-typescript'

import { SignalProtocolStore } from '@/utils/storage-type'
import { SignalDirectory } from '@/utils/signal-directory'

let msgID = 0

function getNewMessageID() {
	return msgID++
}

const adalheidAddress = new SignalProtocolAddress('adalheid', 1)
const brunhildeAddress = new SignalProtocolAddress('brünhild', 1)

export default function ChatTest() {
	//  客户端1仓库
	const [adiStore] = useState(new SignalProtocolStore())
	// 客户端2仓库
	const [brunhildeStore] = useState(new SignalProtocolStore())

	// 客户端1身份
	const [aHasIdentity, setAHasIdentity] = useState(false)
	// 客户端2身份
	const [bHasIdentity, setBHasIdentity] = useState(false)

	const [directory] = useState(new SignalDirectory())
	const [messages, setMessages] = useState([])
	const [processedMessages, setProcessedMessages] = useState([])

	const [hasSession, setHasSession] = useState(false)

	const [adalheidTyping, setAdalheidTyping] = useState('')
	const [brunhildeTyping, setBrunhildeTyping] = useState('')

	const [processing, setProcessing] = useState(false)

	// 发送消息
	const sendMessage = (to, from, message) => {
		const msg = { to, from, message, delivered: false, id: getNewMessageID() }
		setMessages([...messages, msg])
	}

	useEffect(() => {
		if (!messages.find((m) => !m.delivered) || processing) {
			return
		}

		const getReceivingSessionCipherForRecipient = (to) => {
			// send from Brünhild to Adalheid so use his store
			const store = to === 'brünhild' ? brunhildeStore : adiStore
			const address = to === 'brünhild' ? adalheidAddress : brunhildeAddress
			return new SessionCipher(store, address)
		}

		const doProcessing = async () => {
			while (messages.length > 0) {
				const nextMsg = messages.shift()
				if (!nextMsg) {
					continue
				}
				const cipher = getReceivingSessionCipherForRecipient(nextMsg.to)
				const processed = await readMessage(nextMsg, cipher)
				processedMessages.push(processed)
			}
			setMessages([...messages])
			setProcessedMessages([...processedMessages])
		}
		setProcessing(true)
		doProcessing().then(() => {
			setProcessing(false)
		})
	}, [adiStore, brunhildeStore, messages, processedMessages, processing])

	// 阅读消息
	const readMessage = async (msg, cipher) => {
		let plaintext = new Uint8Array().buffer
		if (msg.message.type === 3) {
			console.log({ msg })
			plaintext = await cipher.decryptPreKeyWhisperMessage(msg.message.body, 'binary')
			setHasSession(true)
		} else if (msg.message.type === 1) {
			plaintext = await cipher.decryptWhisperMessage(msg.message.body, 'binary')
		}
		const stringPlaintext = new TextDecoder().decode(new Uint8Array(plaintext))
		console.log('readMessage', stringPlaintext)

		const { id, to, from } = msg
		return { id, to, from, messageText: stringPlaintext }
	}

	
	// 存储在安全的地方
	const storeSomewhereSafe = (store) => (key, value) => {
		store.put(key, value)
	}

	// 生成ID
	const createID = async (name, store) => {
		const registrationId = KeyHelper.generateRegistrationId()
		// 将 RegistrationId 存储在持久且安全的地方...或者这样做。
		storeSomewhereSafe(store)(`registrationID`, registrationId)

		const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
		// 将 IdentityKeyPair 存储在持久且安全的地方......或者这样做。
		storeSomewhereSafe(store)('identityKey', identityKeyPair)

		const baseKeyId = Math.floor(10000 * Math.random())
		const preKey = await KeyHelper.generatePreKey(baseKeyId)
		store.storePreKey(`${baseKeyId}`, preKey.keyPair)

		const signedPreKeyId = Math.floor(10000 * Math.random())
		const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId)
		store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair)
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
	}

	// 创建Adalheid身份
	const createAdalheidIdentity = async () => {
		await createID('adalheid', adiStore)
		console.log({ adiStore })
		setAHasIdentity(true)
	}

	// 创建Brunhilde身份
	const createBrunhildeIdentity = async () => {
		await createID('brünhild', brunhildeStore)
		setBHasIdentity(true)
	}

	const starterMessageBytes = Uint8Array.from([
		0xce, 0x93, 0xce, 0xb5, 0xce, 0xb9, 0xce, 0xac, 0x20, 0xcf, 0x83, 0xce, 0xbf, 0xcf, 0x85
	])

	// 起始消息字节
	const startSessionWithBrunhilde = async () => {
		// get Brünhild' key bundle
		const brunhildeBundle = directory.getPreKeyBundle('brünhild')
		console.log({ brunhildeBundle })

		const recipientAddress = brunhildeAddress

		// Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
		const sessionBuilder = new SessionBuilder(adiStore, recipientAddress)

		// Process a prekey fetched from the server. Returns a promise that resolves
		// once a session is created and saved in the store, or rejects if the
		// identityKey differs from a previously seen identity for this address.
		console.log('adalheid processing prekey')
		await sessionBuilder.processPreKey(brunhildeBundle)

		// Now we can send an encrypted message
		const adalheidSessionCipher = new SessionCipher(adiStore, recipientAddress)
		const ciphertext = await adalheidSessionCipher.encrypt(starterMessageBytes.buffer)

		sendMessage('brünhild', 'adalheid', ciphertext)
		// updateStory('startSessionWithBrunhilde')
	}

	// 与Adalheid 开始会话
	const startSessionWithAdalheid = async () => {
		// 获得阿达尔海德的钥匙包
		const adalheidBundle = directory.getPreKeyBundle('adalheid')
		console.log({ adalheidBundle })

		const recipientAddress = adalheidAddress

		// 为远程recipientId + deviceId元组实例化SessionBuilder。
		const sessionBuilder = new SessionBuilder(brunhildeStore, recipientAddress)

		// 处理从服务器获取的预密钥。返回一个解决的承诺
		// 一旦会话被创建并保存在商店中，或者如果会话被拒绝，
		// IdentityKey 与该地址之前看到的身份不同。
		console.log('brünhild processing prekey')
		await sessionBuilder.processPreKey(adalheidBundle)

		// 现在我们可以发送加密消息
		const brunhildeSessionCipher = new SessionCipher(brunhildeStore, recipientAddress)
		const ciphertext = await brunhildeSessionCipher.encrypt(starterMessageBytes.buffer)

		sendMessage('adalheid', 'brünhild', ciphertext)
		// updateStory('startSessionWithAdalheid')
	}

	// 显示消息
	const displayMessages = (sender) => {
		return processedMessages.map((m) => <p>{m.messageText}</p>)
	}

	// 获取收件人的会话密码
	const getSessionCipherForRecipient = (to) => {
		// 从布伦希尔德发送到阿达尔海德，所以使用他的商店
		const store = to === 'adalheid' ? brunhildeStore : adiStore
		const address = to === 'adalheid' ? adalheidAddress : brunhildeAddress
		return new SessionCipher(store, address)
	}

	// 加密并发送消息
	const encryptAndSendMessage = async (to, message) => {
		const cipher = getSessionCipherForRecipient(to)
		const from = to === 'adalheid' ? 'brünhild' : 'adalheid'
		const ciphertext = await cipher.encrypt(new TextEncoder().encode(message).buffer)
		if (from === 'adalheid') {
			setAdalheidTyping('')
		} else {
			setBrunhildeTyping('')
		}
		sendMessage(to, from, ciphertext)
		// updateStory(sendMessageMD)
	}

	// 发送消息控制
	const sendMessageControl = (to) => {
		const value = to === 'adalheid' ? brunhildeTyping : adalheidTyping
		const onTextChange = to === 'adalheid' ? setBrunhildeTyping : setAdalheidTyping
		return 'sendMessageControl'
	}

	return <Page></Page>
}
