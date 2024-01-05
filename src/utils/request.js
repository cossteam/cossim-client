import axios from 'axios'
import { getUserStorage } from '@/stores/user'

const mode = import.meta.env.MODE || 'development'

const baseURL = {
	development: 'http://192.168.1.12:8080/api/v1',
	production: 'http://192.168.1.8:8081/api/v1'
}

const request = axios.create({
	baseURL: baseURL[mode],
	// baseURL:'/api/v1',
	timeout: 10000
	//   headers: {
	//     'Content-Type': 'application/json',
	//     'Access-Control-Allow-Origin': '*',
	//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
	//   },
})

request.interceptors.request.use(
	(config) => {
		const storage = getUserStorage()
		console.log(storage);
		if (storage && storage.state.isLogin && storage.state.token) {
			config.headers.Authorization = 'Bearer ' +  storage.state.token
		}
		return config
	},
	(error) => {
		// Do something with request error
		console.log(error)
		return Promise.reject(error)
	}
)

request.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		console.log(error)
		return Promise.reject(error)
	}
)

export default request
