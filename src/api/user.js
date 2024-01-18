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
 * 交换E2EKey
 * @param {*} data
 * @param {*} data.public_key
 * @param {*} data.user_id
 * @returns
 */
export function switchE2EKey(data) {
	return request({
		url: `${baseApi}/switch/e2e/key`,
		method: 'POST',
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

/**
 * 修改用户信息
 * @param {*} data
 * @param {*} data.avatar
 * @param {*} data.nickname
 * @param {*} data.signature
 * @param {*} data.status
 * @param {*} data.tel
 * @returns
 */
export function updateUserInfoApi(data) {
	return request({
		url: `${baseApi}/info/modify`,
		method: 'POST',
		data
	})
}

/**
 * 修改密码
 * @param {*} data
 * @param {*} data.old_password
 * @param {*} data.password
 * @param {*} data.confirm_password
 * @returns
 */
export function updatePassWordApi(data) {
	return request({
		url: `${baseApi}/password/modify`,
		method: 'POST',
		data
	})
}

/**
 * 退出登录
 * @returns
 */
export function logoutApi() {
	return request({
		url: `${baseApi}/logout`,
		method: 'POST'
	})
}