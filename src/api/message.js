import request from '@/utils/request'

const baseApi = '/msg/send'

/**
 * 发送私聊消息
 * @param {*} data
 * @param {*} data.content          内容
 * @param {*} data.receiver_id      接收者id
 * @param {*} data.replay_id        回复id
 * @param {*} data.type             消息类型
 * @returns
 */
export function senToUser(data) {
	return request({
		url: baseApi + '/user',
		method: 'post',
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
		url: baseApi + '/group',
		method: 'post',
		data
	})
}
