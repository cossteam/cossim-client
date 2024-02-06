import request from '@/utils/request'

const live = '/live/user'

/**
 * 创建通话
 * @param {*} data
 * @param {*} data.user_id
 * @returns
 */
export function createLiveUserApi(data) {
	return request({
		url: live + '/create',
		method: 'POST',
		data
	})
}

export function joinLiveUserApi(data) {
	return request({
		url: live + '/join',
		method: 'POST',
		data
	})
}

export function leaveLiveUserApi(data) {
	return request({
		url: live + '/leave',
		method: 'POST',
		data
	})
}

export function rejectLiveUserApi(data) {
	return request({
		url: live + '/reject',
		method: 'POST',
		data
	})
}

export function showLiveUserApi(params) {
	return request({
		url: live + '/show',
		method: 'GET',
		params
	})
}
