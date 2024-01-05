import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data
 * @param {*} data.email     	邮箱
 * @param {*} data.password     密码
 * @returns
 */
export function loginApi(data) {
	return request({
		url:'/user/login',
		method: 'post',
		data
	})
}

/**
 * 注册接口
 * @param {*} data
 * @param {*} data.email     	邮箱
 * @param {*} data.password     密码
 * @param {*} data.nickname     昵称
 * @param {*} data.avatar       头像
 * @returns
 */
 export function registerApi(data) {
	return request({
		url:'/user/register',
		method: 'post',
		data
	})
}