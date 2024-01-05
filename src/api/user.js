import request from '@/utils/request'

const baseApi = '/user'

/**
 * 登录接口
 * @param {*} data
 * @param {string} data.email     		邮箱
 * @param {string} data.password     	密码
 * @returns
 */
export function loginApi(data) {
	return request({
		url: `${baseApi}/login`,
		method: 'post',
		data
	})
}

/**
 * 注册接口
 * @param {*} data
 * @param {string} data.email     		邮箱
 * @param {string} data.password     	密码
 * @param {string} data.nickname     	昵称
 * @param {string} data.avatar       	头像
 * @returns
 */
export function registerApi(data) {
	return request({
		url: `${baseApi}/register`,
		method: 'post',
		data
	})
}
