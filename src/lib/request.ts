import { useServerStore } from '@/stores/server'
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
// import useUserStore from '@/stores/user'
// import { RESPONSE_CODE } from '@/utils/enum'
// import PGPUtils from '@/utils/pgp'
// import useRequestStore from '@/stores/request'

const axiosConfig = {
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}
const service = axios.create(axiosConfig)

// 请求拦截器
service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const requestStore = useServerStore.getState()
        config.baseURL = requestStore.config.baseUrl
        const token = useUserStore.getState().token
        if (token) config.headers['Authorization'] = 'Bearer ' + token
        return config
    },
    (error: AxiosError) => Promise.reject(error)
)

service.interceptors.response.use(
    async (response: AxiosResponse) => {
        return response.data
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default service
