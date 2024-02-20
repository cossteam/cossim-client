import request from '@/utils/request'

const liveUser = '/live/user'
const liveGroup = '/live/group'

/**
 * 创建通话
 * @param {*} data
 * @param {*} data.user_id
 * @returns
 */
export function createLiveUserApi(data: any) {
	return request({
		url: liveUser + '/create',
		method: 'POST',
		data
	})
}

/**
 * 创建群聊通话
 * @param {*} data
 * @param {*} data.user_id
 * @returns
 */
export function createLiveGroupApi(data: any) {
	return request({
		url: liveGroup + '/create',
		method: 'POST',
		data
	})
}

/**
 * 加入通话
 * @param data
 * @returns
 */
export function joinLiveUserApi(data?: any) {
	return request({
		url: liveUser + '/join',
		method: 'POST',
		data
	})
}

/**
 * 加入群聊通话
 * @param data
 * @returns
 */
export function joinLiveGroupApi(data?: any) {
	return request({
		url: liveGroup + '/join',
		method: 'POST',
		data
	})
}

/**
 * 结束通话
 * @param data
 * @returns
 */
export function leaveLiveUserApi(data: any) {
	return request({
		url: liveUser + '/leave',
		method: 'POST',
		data
	})
}

/**
 * 结束群聊通话
 * @param data
 * @returns
 */
export function leaveLiveGroupApi(data: any) {
	return request({
		url: liveGroup + '/leave',
		method: 'POST',
		data
	})
}

/**
 * 拒绝通话
 * @param data
 * @returns
 */
export function rejectLiveUserApi(data: any) {
	return request({
		url: liveUser + '/reject',
		method: 'POST',
		data
	})
}

/**
 * 拒绝群聊通话
 * @param data
 * @returns
 */
export function rejectLiveGroupApi(data: any) {
	return request({
		url: liveGroup + '/reject',
		method: 'POST',
		data
	})
}

/**
 * 获取通话信息
 * @param params
 * @returns
 */
export function getLiveInfoUserApi(params: any) {
	return request({
		url: liveUser + '/show',
		method: 'GET',
		params
	})
}

/**
 * 获取群聊通话信息
 * @param params
 * @returns
 */
export function getLiveInfoGroupApi(params: any) {
	return request({
		url: liveGroup + '/show',
		method: 'GET',
		params
	})
}
