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

export class SignalProtocolStore {
	constructor() {
		this._store = {}
	}
	//
	get(key, defaultValue) {
		if (key === null || key === undefined) throw new Error('Tried to get value for undefined/null key')
		if (key in this._store) {
			return this._store[key]
		} else {
			return defaultValue
		}
	}
	remove(key) {
		if (key === null || key === undefined) throw new Error('Tried to remove value for undefined/null key')
		delete this._store[key]
	}
	put(key, value) {
		if (key === undefined || value === undefined || key === null || value === null)
			throw new Error('Tried to store undefined/null')
		this._store[key] = value
	}

	async getIdentityKeyPair() {
		const kp = this.get('identityKey', undefined)
		if (isKeyPairType(kp) || typeof kp === 'undefined') {
			return kp
		}
		throw new Error('Item stored as identity key of unknown type.')
	}

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
	async loadSession(identifier) {
		const rec = this.get('session' + identifier, undefined)
		if (typeof rec === 'string') {
			return rec
		} else if (typeof rec === 'undefined') {
			return rec
		}
		throw new Error(`session record is not an ArrayBuffer`)
	}

	async loadSignedPreKey(keyId) {
		const res = this.get('25519KeysignedKey' + keyId, undefined)
		if (isKeyPairType(res)) {
			return { pubKey: res.pubKey, privKey: res.privKey }
		} else if (typeof res === 'undefined') {
			return res
		}
		throw new Error(`stored key has wrong type`)
	}
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

	// TODO: Why is this keyId a number where others are strings?
	async storeSignedPreKey(keyId, keyPair) {
		return this.put('25519KeysignedKey' + keyId, keyPair)
	}
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
