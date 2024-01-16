export class SignalDirectory {
	_data = {}

	storeKeyBundle(address, bundle) {
		this._data[address] = bundle
	}

	addOneTimePreKeys(address, keys) {
		this._data[address].oneTimePreKeys.unshift(...keys)
	}

	getPreKeyBundle(address) {
		const bundle = this._data[address]
		if (!bundle) {
			return undefined
		}
		const oneTimePreKey = bundle.oneTimePreKeys.pop()
		const { identityPubKey, signedPreKey, registrationId } = bundle
		return { identityKey: identityPubKey, signedPreKey, preKey: oneTimePreKey, registrationId }
	}
}
