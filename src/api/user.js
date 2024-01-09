import request from '@/utils/request'

const baseApi = '/user'

export function setPgpKeyApi(data) {
	return request({
		url: `${baseApi}/key/set`,
		method: 'post',
		data
	})
}

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

/**
 * 查询用户信息
 * @param {*} params
 * @param {string} params.user_id     	用户 邮箱 | id
 * @param {string} params.type     		指定根据id还是邮箱类型查找
 * @returns
 */
export function getUserInfoApi(params) {
	return request({
		url: `${baseApi}/info`,
		method: 'get',
		params
	})
}