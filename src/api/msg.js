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
 * @param {*} data.type			消息类型 => 1: 文本消息 2: 语音消息 3: 图片消息 
 * @param {*} data.content	    消息内容
 * @param {*} data.page_num		当前页
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
export function sendToGroup(data) {
	return request({
		url: baseApi + '/send/group',
		method: 'POST',
		data
	})
}

/**
 * 获取指定对话落后消息
 * @param {Array} data
 * @param {*} data.dialog_id
 * @param {*} data.msg_id
 */
export function getBehindMsgApi(data) {
	return request({
		url: baseApi + '/after/get',
		method: 'POST',
		data: data
	})
}