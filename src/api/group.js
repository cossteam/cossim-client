import request from '@/utils/request'

const group = '/group'
const relationGroup = '/relation/group'

/**
 * 创建群聊
 * @param {Object} data
 * @param {String} data.avatar
 * @param {String} data.name
 * @param {String} data.type
 * @param {String} data.max_members_limit
 * @param {Array} data.member
 * @returns
 */
export function groupCreateApi(data) {
	return request({
		url: group + '/create',
		method: 'POST',
		data
	})
}

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
