import axios from 'axios'
import { getStorage } from '@/utils/stroage'
import PGPUtils from '@/utils/PGPUtils'

export const mode = import.meta.env.MODE || 'development'
export const baseURL = {
	development: 'http://43.229.28.107:8080/api/v1',
	// development: 'http://192.168.100.145:8080/api/v1',
	production: 'http://43.229.28.107:8080/api/v1'
}
const axiosConfig = {
	baseURL: baseURL[mode],
	// baseURL:'/api/v1',
	timeout: 10000
	//   headers: {
	//     'Content-Type': 'application/json',
	//     'Access-Control-Allow-Origin': '*',
	//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
	//   },
}

const request = axios.create(axiosConfig)

// 是否启用PGP通讯加密
const encrypt = import.meta.env.ENCRYPT || '1' || 'encrypt' // 加密开关
// 使用独立的 Axios 实例，避免触发请求拦截器
const publicKeyInstance = axios.create(axiosConfig)

const encryptPGP = async (serverPublicKey, msg) => {
	const passwords = ['cossim'] // 密钥 // TODO： 移动到环境变量
	// 通知服务端修改客户端公钥
	const encryptedData = await PGPUtils.aes256Encrypt(msg, passwords[0])
	// 使用服务端公钥加密 AES256 密钥
	const encryptedPassword = await PGPUtils.rsaEncrypt(serverPublicKey, passwords[0])
	const encryptMsg = {
		message: encryptedData,
		secret: encryptedPassword
	}
	return encryptMsg
}
// 获取服务端公钥的函数
const getServerPublicKey = async () => {
	const key = 'SERVERPUBLICKEY'
	let serverPublicKey = window.localStorage.getItem(key)
	if (!serverPublicKey) {
		const response = await publicKeyInstance.get('/user/system/key/get')
		serverPublicKey = response?.data?.data?.public_key
		window.localStorage.setItem(key, serverPublicKey)
	}
	return serverPublicKey
}
const setClientPublicKey = async (data) => {
	return publicKeyInstance({
		url: `/user/key/set`,
		method: 'post',
		data
	})
}
const setClientKeys = (keys) => {
	window.localStorage.setItem('PGPKEYSCLIENT', JSON.stringify(keys))
}
/**
 *
 * @returns {privateKey, publicKey, revocationCertificate}
 */
const getClientKeys = async (serverPublicKey) => {
	try {
		let clientKey = JSON.parse(window.localStorage.getItem('PGPKEYSCLIENT'))
		if (!clientKey) {
			// 生成客户端公钥
			const { privateKey, publicKey, privateKeyObj, publicKeyObj, revocationCertificate } =
				await PGPUtils.generateKeyPair()
			clientKey = {
				privateKey,
				publicKey,
				privateKeyObj,
				publicKeyObj,
				revocationCertificate
			}
			console.log(clientKey)
			// 存储用户密钥数据下次请求使用
			setClientKeys(clientKey)
			// // 通知服务器更换客户端公钥
			// // 使用RSA和AES256加密数据
			// const msg = await encryptPGP(serverPublicKey, {
			// 	public_key: clientKey.publicKey
			// })
			// console.log(msg)
			// await setClientPublicKey(msg)
		}
		return clientKey
	} catch (error) {
		console.log(error)
		return null
	}
}

// 请求拦截器
request.interceptors.request.use(
	async (config) => {
		const storage = getStorage()
		if (storage && storage.state.isLogin && storage.state.token) {
			config.headers.Authorization = 'Bearer ' + storage.state.token
		}
		/////////////////////////////////////////////////////////////////////////////////////////////
		// PGP 加密 Start
		/////////////////////////////////////////////////////////////////////////////////////////////
		// TODO：文件上传相关接口跳过
		console.log('TODO：文件上传相关接口跳过加密')
		console.log(config)
		console.log(config.data)
		// debugger
		if (encrypt !== 'encrypt') return config
		// 请求数据
		const requestData = config.data
		// 获取服务端公钥
		const serverPublicKey = await getServerPublicKey()
		// 获取客户端公钥
		const clientKey = await getClientKeys(serverPublicKey)
		console.log(clientKey)
		// 注册时请求数据需要携带 public_key
		if (config.url === '/user/register') {
			requestData['public_key'] = clientKey.publicKeyObj
		}
		// 使用RSA和AES256加密数据
		config.data = await encryptPGP(serverPublicKey, requestData)
		console.log(config)
		console.log(config.data)
		/////////////////////////////////////////////////////////////////////////////////////////////
		// PGP 加密 END
		/////////////////////////////////////////////////////////////////////////////////////////////
		return config
	},
	(error) => {
		// Do something with request error
		console.log(error)
		return Promise.reject(error)
	}
)

// 响应拦截器
request.interceptors.response.use(
	async (response) => {
		/////////////////////////////////////////////////////////////////////////////////////////////
		// PGP 解密 Start
		/////////////////////////////////////////////////////////////////////////////////////////////
		console.log(response)
		if (encrypt !== 'encrypt') return response.data
		try {
			const responseData = response.data
			if (!responseData?.secret) return responseData
			// 获取服务端公钥
			const serverPublicKey = await getServerPublicKey()
			// 获取客户端密钥
			const clientKey = await getClientKeys(serverPublicKey)
			console.log(clientKey)
			const aesKey = await PGPUtils.rsaDecrypt(clientKey.privateKeyObj, 'cossim', responseData.secret)
			console.log(aesKey)
			const decryptedData = await PGPUtils.aes256Decrypt(responseData.message, aesKey)
			response.data = JSON.parse(decryptedData)
		} catch (error) {
			console.log(error)
		}
		/////////////////////////////////////////////////////////////////////////////////////////////
		// PGP 解密 END
		/////////////////////////////////////////////////////////////////////////////////////////////
		return response.data
	},
	(error) => {
		console.log(error)
		// return error.response.data
		return Promise.reject(error)
	}
)

export default request
