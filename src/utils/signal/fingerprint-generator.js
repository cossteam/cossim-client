import Fingerprint2 from 'fingerprintjs2'

export function createFingerprintGenerator() {
	let fingerprint = ''
	Fingerprint2.get((components) => {
		// 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
		// 配置的值的数组
		const values = components.map((component) => component.value)
		// 生成浏览器指纹
		fingerprint = Fingerprint2.x64hash128(values.join(''), 31)

		console.log(fingerprint)
	})

	return fingerprint
}
