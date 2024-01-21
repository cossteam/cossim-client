import axios from 'axios'
import { getStorageName, getStorage } from '@/utils/stroage'
import PGPUtils from '@/utils/PGPUtils'
import { f7 } from 'framework7-react'

export const mode = import.meta.env.MODE || 'development'
// export const HOST = '43.229.28.107:8080' // 线上
export const HOST = '192.168.130.230:8080' // 本地
export const baseURL = {
	development: `http://${HOST}/api/v1`,
	production: `http://${HOST}/api/v1`
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
// 使用独立的 Axios 实例，避免触发请求拦截器
const publicKeyInstance = axios.create(axiosConfig)

// PGP通讯加密配置
const pgpEnv = {
	openEncrypt: false, // 是否启用
	userInfo: {
		name: 'coss',
		email: 'coss@cossim.com'
	},
	passphrase: 'cossim', // 密码短语
	aesPassWord: 'cossim'
}
/**
 * 使用 PGP 加密（AES256加密内容，RSA加密AES256密钥）
 * @param {*} serverPublicKey
 * @param {*} msg
 * @returns
 */
const encryptPGP = async (serverPublicKey, msg) => {
	// 通知服务端修改客户端公钥
	const encryptedData = await PGPUtils.aes256Encrypt(msg, pgpEnv.aesPassWord)
	// 使用服务端公钥加密 AES256 密钥
	const encryptedPassword = await PGPUtils.rsaEncrypt(serverPublicKey, pgpEnv.aesPassWord)
	const encryptMsg = {
		message: encryptedData,
		secret: encryptedPassword
	}
	return encryptMsg
}
/**
 * 获取服务端公钥
 * @returns
 */
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
/**
 * 保存客户端密钥对
 * @param {*} keys
 */
const setClientKeys = (keys) => {
	window.localStorage.setItem('PGPKEYSCLIENT', JSON.stringify(keys))
}
/**
 * 获取客户端密钥对
 * @returns {privateKey, publicKey, revocationCertificate}
 */
const getClientKeys = async () => {
	try {
		let clientKey = JSON.parse(window.localStorage.getItem('PGPKEYSCLIENT'))
		if (!clientKey) {
			// 生成客户端公钥
			const { privateKey, publicKey, revocationCertificate } = await PGPUtils.generateKeyPair(
				pgpEnv.userInfo.name,
				pgpEnv.userInfo.email,
				pgpEnv.passphrase
			)
			clientKey = {
				privateKey,
				publicKey,
				revocationCertificate
			}
			// 存储用户密钥数据下次请求使用
			setClientKeys(clientKey)
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
		if (config.url === '/user/register') {
			config.data['public_key'] = '1' // 临时使用，用于通过注册接口必填校验
		}
		/////////////////////////////////////////////////////////////////////////////////////////////
		// PGP 加密 Start
		/////////////////////////////////////////////////////////////////////////////////////////////
		// TODO：文件上传相关接口跳过
		console.log('TODO：文件上传相关接口跳过加密')
		// console.log('请求', config)
		if (!pgpEnv.openEncrypt) return config
		// 请求数据
		const requestData = config.data
		// 获取服务端公钥
		const serverPublicKey = await getServerPublicKey()
		// 获取客户端公钥
		const clientKey = await getClientKeys(serverPublicKey)
		// 注册时请求数据需要携带 public_key
		if (config.url === '/user/register') {
			requestData['public_key'] = clientKey.publicKey
		}
		// 使用RSA和AES256加密数据
		config.data = await encryptPGP(serverPublicKey, requestData)
		// console.log('请求【加密】', config)
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
		// console.log('响应', response)
		if (!pgpEnv.openEncrypt) return response.data
		try {
			const responseData = response.data
			if (!responseData?.secret) return responseData
			// 获取服务端公钥
			const serverPublicKey = await getServerPublicKey()
			// 获取客户端密钥
			const clientKey = await getClientKeys(serverPublicKey)
			const aesKey = await PGPUtils.rsaDecrypt(clientKey.privateKey, pgpEnv.passphrase, responseData.secret)
			const decryptedData = await PGPUtils.aes256Decrypt(responseData.message, aesKey)
			response.data = decryptedData
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
		if (error.response) {
			if (error.response.status === 401) {
				f7.dialog.close()
				f7.dialog.alert('登录已过期，请重新登录', '登录过期', () => {
					// 清除 token 及 用户信息
					const storage = getStorage()
					storage.state.isLogin = false
					delete storage.state.token
					delete storage.state.user
					window.localStorage.setItem(getStorageName(), JSON.stringify(storage))
					window.location.href = '/'
					return false
				})
			}
		}
		// return error.response.data
		return Promise.reject(error)
	}
)

export default request
