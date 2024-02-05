import request from '@/utils/request'

const baseApi = '/relation/user'

/**
 * 获取好友列表
 * @param {Object} params
 * @param {String} params.user_id         用户id
 * @returns {Promise<Object>}
 */
export function friendListApi(params) {
	return request({
		url: `${baseApi}/friend_list`,
		method: 'get',
		params
	})
}

/**
 * 添加黑名单
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function addBlackListApi(data) {
	return request({
		url: `${baseApi}/add_blacklist`,
		method: 'post',
		data
	})
}

/**
 * 添加好友
 * @param {Object} data
 * @param {String} data.user_id         添加对面的用户 id
 * @param {String} data.msg       		添加消息
 * @param {String} data.e2e_public_key  公钥
 * @returns {Promise<Object>}
 */
export function addFriendApi(data) {
	return request({
		url: `${baseApi}/add_friend`,
		method: 'post',
		data
	})
}

/**
 * 获取黑名单列表
 * @param {Object} params
 * @param {String} params.user_id         用户id
 * @returns {Promise<Object>}
 */
export function blackListApi(params) {
	return request({
		url: `${baseApi}/blacklist`,
		method: 'get',
		params
	})
}

/**
 * 确认添加或拒绝好友
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.e2e_public_key      
 * @returns {Promise<Object>}
 */
export function confirmAddFriendApi(data) {
	return request({
		url: `${baseApi}/manage_friend`,
		method: 'post',
		data
	})
}

/**
 * 删除黑名单
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @param {String} data.friend_id       好友id
 * @returns {Promise<Object>}
 */
export function deleteBlackListApi(data) {
	return request({
		url: `${baseApi}/delete_blacklist`,
		method: 'post',
		data
	})
}

/**
 * 删除好友
 * @param {Object} data
 * @param {String} data.user_id         用户id
 * @returns {Promise<Object>}
 */
export function deleteFriendApi(data) {
	return request({
		url: `${baseApi}/delete_friend`,
		method: 'post',
		data
	})
}

/**
 * 交换端对端公钥
 * @param {Object} data
 * @param {String} data.public_key      公钥
 * @param {String} data.user_id         用户id
 * @returns {Promise<Object>}
 */
export function switchE2EKeyApi(data) {
	return request({
		url: `${baseApi}/switch/e2e/key`,
		method: 'POST',
		data
	})
}

/**
 * 好友申请列表
 * @param {Object} params
 */
export function friendApplyListApi(params) {
	return request({
		url: `${baseApi}/request_list`,
		method: 'get',
		params
	})
}

/**
 * 设置用户消息静默通知
 * @param {Object} data
 * @param {String} data.user_id
 * @param {String} data.is_silence
 */
export function setSilenceApi(data) {
	return request({
		url: `${baseApi}/silent`,
		method: 'POST',
		data
	})
}

