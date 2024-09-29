import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { RESPONSE_CODE } from '@/utils/enum'
import PGPUtils from '@/utils/pgp'
import useRequestStore from '@/stores/request'
import { useAuthStore } from '@/stores/auth'

const axiosConfig = {
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}
const service = axios.create(axiosConfig)
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
const encryptPGP = async (serverPublicKey: any, msg: any) => {
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
        window.localStorage.setItem(key, serverPublicKey!)
    }
    return serverPublicKey
}
/**
 * 获取客户端密钥对
 * @returns {privateKey, publicKey, revocationCertificate}
 */
const getClientKeys = async () => {
    try {
        const clientKey = JSON.parse(window.localStorage.getItem('PGPKEYSCLIENT')!)
        if (!clientKey) {
            return null
        }
        return clientKey
    } catch (error) {
        console.log(error)
        return null
    }
}

// 请求拦截器
service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const requestStore = useRequestStore.getState()
        config.baseURL = requestStore.config.baseUrl
        const token = useAuthStore.getState().token
        if (token) config.headers['Authorization'] = 'Bearer ' + token
        /////////////////////////////////////////////////////////////////////////////////////////////
        // PGP 加密 Start
        /////////////////////////////////////////////////////////////////////////////////////////////
        // TODO：文件上传相关接口跳过
        // console.log('TODO：文件上传相关接口跳过加密')
        // console.log('请求', config)
        if (!pgpEnv.openEncrypt) return config
        // 请求数据
        const requestData = config.data
        // 获取服务端公钥
        const serverPublicKey = await getServerPublicKey()
        // 获取客户端公钥
        const clientKey = await getClientKeys()
        if (!clientKey) return config
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
    (error: AxiosError) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
    async (response: AxiosResponse) => {
        // 获取错误码
        const code = response.data.code || 200
        const userStore = useAuthStore.getState()
        // code 的取值根据后台返回为准
        switch (code) {
            case RESPONSE_CODE.Unauthorized:
                console.log('登录过期')
                userStore.clear()
                break
        }
        /////////////////////////////////////////////////////////////////////////////////////////////
        // PGP 解密 Start
        /////////////////////////////////////////////////////////////////////////////////////////////
        // console.log('响应', response)
        if (!pgpEnv.openEncrypt) return response.data
        try {
            const responseData = response.data
            if (!responseData?.secret) return responseData
            // 获取服务端公钥
            await getServerPublicKey()
            // 获取客户端密钥
            const clientKey = await getClientKeys()
            if (!clientKey) return responseData
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
    (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401) {
                useAuthStore().update({
                    userId: '',
                    userInfo: '',
                    token: ''
                })
                location.reload()
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)

// interface requestConfig {
// 	/** 是否取消重复请求 */
// 	isCancelRepeat?: boolean
// }

// /**
//  * @param config
//  * @returns
//  */
// function request(config: InternalAxiosRequestConfig & requestConfig) {
// 	const { isCancelRepeat = true } = config
// 	// // 如果需要取消重复请求
// 	// if (isCancelRepeat) {
// 	// 	cancelTokenSource.cancel('取消重复请求')
// 	// 	config.cancelToken = cancelTokenSource.token
// 	// }

// 	// 去除自定义参数
// 	// delete config.isCancelRepeat
// 	const cancelTokenSource = axios.CancelToken.source()

// 	return service({ ...config, cancelToken: isCancelRepeat ? cancelTokenSource.token : undefined })
// }

export default service
