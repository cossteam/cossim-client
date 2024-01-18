import request from '@/utils/request'

// const baseApi = '/group'
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
