import { useServerStore } from '@/stores/server'
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const axiosConfig = {
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}
const service = axios.create(axiosConfig)

service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const baseUrl = useServerStore.getState().baseUrl
        config.baseURL = baseUrl
        // const token = useUserStore.getState().token
        // if (token) config.headers['Authorization'] = 'Bearer ' + token
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