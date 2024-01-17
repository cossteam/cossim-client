import { SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'

// Type guards
export function isKeyPairType(kp) {
	return !!(kp?.privKey && kp?.pubKey)
}

export function isPreKeyType(pk) {
	return typeof pk?.keyId === 'number' && isKeyPairType(pk?.keyPair)
}

export function isSignedPreKeyType(spk) {
	return spk?.signature && isPreKeyType(spk)
}

function isArrayBuffer(thing) {
	const t = typeof thing
	return !!thing && t !== 'string' && t !== 'number' && 'byteLength' in thing
}

// 此代码片段是一个名为 isKeyPairType 的 JavaScript 函数。它接受一个参数 kp 并检查它是否同时具有 privKey 和 pubKey 属性。
// 它使用可选链接 (?.) 来安全地访问这些属性，如果两个属性都存在，则返回 true，否则返回 false。
export class SignalProtocolStore {
	/**
	 * 创建构造函数的新实例。
	 *
	 * @param {Object} store -商店对象（可选）。
	 */
	constructor(store) {
		this._store = store ? store._store : {}
	}

	/**
	 * 从存储中检索与指定键关联的值。
	 *
	 * @param {any} key -要检索其值的键。
	 * @param {any} defaultValue -如果在商店中找不到密钥则返回的默认值。
	 * @return {any} 与键关联的值，如果未找到键，则返回默认值。
	 */
	get(key, defaultValue) {
		if (key === null || key === undefined) throw new Error('Tried to get value for undefined/null key')
		if (key in this._store) {
			return this._store[key]
		} else {
			return defaultValue
		}
	}

	/**
	 * 从存储中删除与给定键关联的值。
	 *
	 * @param {any} key -要删除的值的键。
	 * @throws {Error} 如果键未定义或为 null，则抛出错误。
	 */
	remove(key) {
		if (key === null || key === undefined) throw new Error('Tried to remove value for undefined/null key')
		delete this._store[key]
	}
	
	/**
	 * 在数据存储中存储键值对。
	 *
	 * @param {any} key -用于存储值的键。
	 * @param {any} value -要存储的值。
	 * @throws {Error} 如果键或值未定义或为 null。
	 */
	put(key, value) {
		if (key === undefined || value === undefined || key === null || value === null)
			throw new Error('Tried to store undefined/null')
		this._store[key] = value
	}

	/**
	 * 检索身份密钥对。
	 *
	 * @return {Promise<KeyPair|undefined>} 身份密钥对，如果未找到，则为未定义。
	 * @throws {Error} 如果存储为身份密钥的项目类型未知，则抛出错误。
	 */
	async getIdentityKeyPair() {
		const kp = this.get('identityKey', undefined)
		if (isKeyPairType(kp) || typeof kp === 'undefined') {
			return kp
		}
		throw new Error('Item stored as identity key of unknown type.')
	}

	/**
	 * 检索本地注册 ID。
	 *
	 * @return {number|undefined} 本地注册ID。
	 * @throws {Error} 如果存储的注册 ID 不是数字。
	 */
	async getLocalRegistrationId() {
		const rid = this.get('registrationId', undefined)
		if (typeof rid === 'number' || typeof rid === 'undefined') {
			return rid
		}
		throw new Error('Stored Registration ID is not a number')
	}

	// eslint-disable-next-line no-unused-vars
	isTrustedIdentity(identifier, identityKey, _direction) {
		if (identifier === null || identifier === undefined) {
			throw new Error('tried to check identity key for undefined/null key')
		}
		const trusted = this.get('identityKey' + identifier, undefined)

		// TODO: Is this right? If the ID is NOT in our store we trust it?
		if (trusted === undefined) {
			return Promise.resolve(true)
		}
		return Promise.resolve(arrayBufferToString(identityKey) === arrayBufferToString(trusted))
	}
	/**
	 * 异步加载具有指定密钥 ID 的预密钥。
	 *
	 * @param {number} keyId -要加载的预密钥的 ID。
	 * @return {对象| undefined} 加载的带有公钥和私钥的预密钥对象，如果预密钥不存在，则为未定义。
	 * @throws {Error} 如果存储的密钥类型错误。
	 */
	async loadPreKey(keyId) {
		let res = this.get('25519KeypreKey' + keyId, undefined)
		if (isKeyPairType(res)) {
			res = { pubKey: res.pubKey, privKey: res.privKey }
			return res
		} else if (typeof res === 'undefined') {
			return res
		}
		throw new Error(`stored key has wrong type`)
	}
	/**
	 * 通过标识符加载会话。
	 *
	 * @param {string} 标识符 -会话的标识符。
	 * @return {string|undefined} 字符串形式的会话记录，如果不存在则为 undefined。
	 * @throws {Error} 如果会话记录不是 ArrayBuffer。
	 */
	async loadSession(identifier) {
		const rec = this.get('session' + identifier, undefined)
		if (typeof rec === 'string') {
			return rec
		} else if (typeof rec === 'undefined') {
			return rec
		}
		throw new Error(`session record is not an ArrayBuffer`)
	}

	/**
	 * 从数据库加载签名的预密钥。
	 *
	 * @param {string} keyId -要加载的签名预密钥的 ID。
	 * @return {Object} -包含签名预密钥的公钥和私钥的对象。
	 *                    如果未找到该键，则返回 undefined。
	 * @throws {Error} -如果存储的密钥类型错误。
	 */
	async loadSignedPreKey(keyId) {
		const res = this.get('25519KeysignedKey' + keyId, undefined)
		if (isKeyPairType(res)) {
			return { pubKey: res.pubKey, privKey: res.privKey }
		} else if (typeof res === 'undefined') {
			return res
		}
		throw new Error(`stored key has wrong type`)
	}
	/**
	 * 从存储中删除预密钥。
	 *
	 * @param {string} keyId -要删除的预密钥的 ID。
	 */
	async removePreKey(keyId) {
		this.remove('25519KeypreKey' + keyId)
	}
	async saveIdentity(identifier, identityKey) {
		if (identifier === null || identifier === undefined)
			throw new Error('Tried to put identity key for undefined/null key')

		const address = SignalProtocolAddress.fromString(identifier)

		const existing = this.get('identityKey' + address.getName(), undefined)
		this.put('identityKey' + address.getName(), identityKey)
		if (existing && !isArrayBuffer(existing)) {
			throw new Error('Identity Key is incorrect type')
		}

		if (existing && arrayBufferToString(identityKey) !== arrayBufferToString(existing)) {
			return true
		} else {
			return false
		}
	}
	async storeSession(identifier, record) {
		return this.put('session' + identifier, record)
	}
	async loadIdentityKey(identifier) {
		if (identifier === null || identifier === undefined) {
			throw new Error('Tried to get identity key for undefined/null key')
		}

		const key = this.get('identityKey' + identifier, undefined)
		if (isArrayBuffer(key)) {
			return key
		} else if (typeof key === 'undefined') {
			return key
		}
		throw new Error(`Identity key has wrong type`)
	}
	async storePreKey(keyId, keyPair) {
		return this.put('25519KeypreKey' + keyId, keyPair)
	}

	// TODO：为什么这个 keyId 是数字，而其他 keyId 是字符串？
	async storeSignedPreKey(keyId, keyPair) {
		return this.put('25519KeysignedKey' + keyId, keyPair)
	}
	/**
	 * 删除具有给定密钥 ID 的签名预密钥。
	 *
	 * @param {type} keyId -要删除的签名预密钥的 ID。
	 * @return {Promise} 当签名的预密钥被删除时解决的承诺。
	 */
	async removeSignedPreKey(keyId) {
		return this.remove('25519KeysignedKey' + keyId)
	}
	async removeSession(identifier) {
		return this.remove('session' + identifier)
	}
	async removeAllSessions(identifier) {
		for (const id in this._store) {
			if (id.startsWith('session' + identifier)) {
				delete this._store[id]
			}
		}
	}
}

export function arrayBufferToString(b) {
	return uint8ArrayToString(new Uint8Array(b))
}

export function uint8ArrayToString(arr) {
	const end = arr.length
	let begin = 0
	if (begin === end) return ''
	let chars = []
	const parts = []
	while (begin < end) {
		chars.push(arr[begin++])
		if (chars.length >= 1024) {
			parts.push(String.fromCharCode(...chars))
			chars = []
		}
	}
	return parts.join('') + String.fromCharCode(...chars)
}
