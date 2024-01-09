import axios from 'axios'
import { getStorage } from '@/utils/stroage'
import PGP from '@/utils/PGP'

const mode = import.meta.env.MODE || 'development'
const baseURL = {
	development: 'http://43.229.28.107:8080/api/v1',
	// development: 'http://192.168.100.150:8080/api/v1',
	production: 'http://192.168.1.12:8080/api/v1'
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
const encrypt = import.meta.env.ENCRYPT // 加密开关
const clientKey = {}

// 获取服务端公钥的函数
const getServerPublicKey = async () => {
	// 使用独立的 Axios 实例，避免触发请求拦截器
	const publicKeyInstance = axios.create(axiosConfig)
	const response = await publicKeyInstance.get('/user/system/key/get')
	return response?.data?.data?.public_key
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
		if (encrypt !== 'encrypt') return config
		// 获取服务器公钥
		clientKey.serverPublicKey = clientKey?.serverPublicKey ? clientKey.serverPublicKey : await getServerPublicKey()
		// 生成客户端公钥
		const { privateKey, publicKey, revocationCertificate } = await PGP.generateKeys()
		clientKey.privateKey = privateKey
		clientKey.publicKey = publicKey
		clientKey.revocationCertificate = revocationCertificate
		const requestData = {
			...config.data,
			public_key: publicKey
		}
		// 加密数据 AES256
		const passwords = ['coss'] // 密钥
		const encryptedData = await PGP.encryptAES256(JSON.stringify(requestData), passwords[0])
		// 使用服务端公钥加密 AES256 密钥
		const encryptedPassword = await PGP.encrypt({
			text: passwords[0],
			key: clientKey.serverPublicKey
		})
		const newRequestData = {
			message: encryptedData,
			secret: encryptedPassword
		}
		config.data = newRequestData
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
		if (encrypt !== 'encrypt') return response.data
		const responseData = response.data
		const aesKey = await PGP.decrypt(responseData.secret)
		const decryptedData = await PGP.decryptAES256(responseData.message, aesKey)
		response.data = JSON.parse(decryptedData)
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
