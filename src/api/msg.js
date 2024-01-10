import request from '@/utils/request'

const baseApi = '/msg'

export function getChatList(params) {
	return request({
		url: baseApi + '/dialog/list',
		method: 'GET',
		params
	})
}

/**
 * 获取私聊消息
 * @param {*} data
 * @param {*} data.user_id
 * @param {*} data.type
 * @param {*} data.content
 * @param {*} data.page_num
 * @param {*} data.page_size
 * @returns
 */
export function getMsgByUser(data) {
	return request({
		url: baseApi + '/list/user',
		method: 'GET',
		params: data
	})
}

/**
 * 发送私聊消息
 * @param {*} data
 * @param {*} data.content          内容
 * @param {*} data.receiver_id      接收者id
 * @param {*} data.replay_id        回复id
 * @param {*} data.type             消息类型
 * @returns
 */
export function sendToUser(data) {
	return request({
		url: baseApi + '/send/user',
		method: 'POST',
		data
	})
}

/**
 * 发送群聊消息
 * @param {*} data
 * @param {*} data.content          内容
 * @param {*} data.receiver_id      接收者id
 * @param {*} data.replay_id        回复id
 * @param {*} data.type             消息类型
 * @returns
 */
export function sentToGroup(data) {
	return request({
		url: baseApi + '/send/group',
		method: 'POST',
		data
	})
}
