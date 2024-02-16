import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { getCookie } from './cookie'
import { TOKEN, RESPONSE_CODE } from '@/shared'

const service = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 50000,
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	}
})

service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getCookie(TOKEN)
		if (token) config.headers['Authorization'] = 'Bearer ' + token
		return config
	},
	(error: Error) => Promise.reject(error)
)

service.interceptors.response.use(
	(response: AxiosResponse) => {
		// 获取错误码
		const code = response.data.code || 200
		// code 的取值根据后台返回为准
		switch (code) {
			case RESPONSE_CODE.Unauthorized:
				console.log('登录过期')
				break
		}

		return response.data
	},
	(error: Error) => Promise.reject(error)
)

export default service
