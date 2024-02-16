import type { MessageListParams, SendMessage } from '@/types/api/msg'
import request from '@/utils/request'

class MsgService {
	private baseUrl: string = '/msg'

	/**
	 * 获取对话列表
	 *
	 * @returns
	 */
	getDialogApi(): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/dialog/list`
		})
	}

	/**
	 * 获取私聊消息列表
	 *
	 * @returns
	 */
	getUserMessageListApi(params: MessageListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/list/user`,
			params
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
	sendUserMessageApi(data: SendMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/send/user`,
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
	sendGroupMessageApi(data:SendMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}send/group`,
			method: 'POST',
			data
		})
	}
}

export default new MsgService()
