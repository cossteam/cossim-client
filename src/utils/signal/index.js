export function cretae() {
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