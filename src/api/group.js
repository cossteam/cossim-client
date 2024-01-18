import request from '@/utils/request'

const group = '/group'
const relationGroup = '/relation/group'

/**
 * 获取群申请列表
 * @param {*} params
 * @returns
 */
export function groupRequestListApi(params) {
	return request({
		url: relationGroup + '/request_list',
		method: 'GET',
		params
	})
}

/**
 * 管理加入群聊
 * @param {*} data
 * @returns
 */
export function confirmAddGroupApi(data) {
	return request({
		url: relationGroup + '/manage_join_group',
		method: 'POST',
		data
	})
}

/**
 * 获取群聊列表
 * @param {*} param
 * @returns
 */
export function groupListApi(param) {
	return request({
		url: relationGroup + '/list',
		method: 'GET',
		params: param
	})
}

/**
 * 获取群聊信息
 * @param {*} param
 * @returns
 */
export function groupInfoApi(param) {
	return request({
		url: group + '/info',
		method: 'GET',
		params: param
	})
}

/**
 * 获取群成员列表
 * @param {*} param
 * @returns
 */
export function groupMemberApi(param) {
	return request({
		url: relationGroup + '/member',
		method: 'GET',
		params: param
	})
}
