import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getFingerPrintID = async () => {
	const fpPromise = await FingerprintJS.load()
	const result = await fpPromise.get()
	return result.visitorId
}
