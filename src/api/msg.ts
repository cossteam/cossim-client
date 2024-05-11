import type {
	EditMessage,
	GetBehindMessage,
	GetDialog,
	GetGroupMessage,
	GetMessage,
	LabelMessage,
	MessageListParams,
	ReadGroupMessage,
	ReadMessage,
	RevokeMessage,
	SendGroupMessage,
	SendMessage
} from '@/types/api/msg'
import request from '@/utils/request'

class MsgServiceImpl {
	private baseUrl: string = '/msg'

	/**
	 * 获取对话列表
	 *
	 * @returns
	 */
	getDialogApi(params: GetDialog): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/dialog/list`,
			params
		})
	}

	/**
	 * 获取私聊消息列表
	 *
	 * @returns
	 */
	getUserMessageListApi(params: MessageListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/list`,
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
			url: `${this.baseUrl}/user/send`,
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
	sendGroupMessageApi(data: SendGroupMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/send`,
			method: 'POST',
			data
		})
	}

	/**
	 * 编辑用户信息
	 * @param {*} data
	 * @param {string} data.content		消息
	 * @param {number} id		消息id
	 * @param {number} data.msg_type	消息类型
	 */
	editUserMessageApi(id:number,data: EditMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/${id}`,
			method: 'PUT',
			data
		})
	}

	/**
	 * 编辑群聊消息
	 * @param {*} data
	 * @param {*} data.content			消息内容
	 * @param {*} id			消息id
	 * @param {*} data.type				消息类型
	 */
	editGroupMessageApi(id:number,data: EditMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/${id}`,
			method: 'PUT',
			data
		})
	}

	/**
	 * 标注私聊消息
	 * @param {*} data
	 * @param {*} id			消息id
	 * @param {*} data.is_label			是否标记
	 */
	labelUserMessageApi(id:number,data: LabelMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/${id}/label`,
			method: 'POST',
			data
		})
	}

	/**
	 * 标注群聊消息
	 * @param {*} data
	 * @param {*} id			消息id
	 * @param {*} data.is_label			是否标记
	 */
	labelGroupMessageApi(id:number,data: LabelMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/${id}/label`,
			method: 'POST',
			data
		})
	}

	/**
	 * 批量设置群聊消息已读
	 * @param {*} data
	 * @param {*} data.msg_ids			消息id列表
	 * @param {*} data.dialog_id		对话id
	 */
	readGroupMessageApi(data: ReadMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/read`,
			method: 'PUT',
			data
		})
	}

	/**
	 * 批量设置私聊消息已读
	 * @param {*} data
	 * @param {*} data.msg_ids			消息id列表
	 * @param {*} data.dialog_id		对话id
	 */
	readUserMessageApi(data: ReadMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/read`,
			method: 'PUT',
			data
		})
	}

	/**
	 * 获取指定对话落后的消息
	 *
	 * @param {*} data
	 * @param {*} data.dialog_id
	 * @param {*} data.msg_id
	 */
	getBehindMessageApi(data: GetBehindMessage[]): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/dialog/after`,
			method: 'POST',
			data
		})
	}

	/**
	 * 获取私聊消息
	 *
	 * @param {GetMessage} params
	 */
	getUserMessageApi(params: GetMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/list`,
			params
		})
	}

	/**
	 * 获取群聊消息
	 *
	 * @param {GetGroupMessage} params
	 */
	getGroupMessageApi(params: GetGroupMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/list`,
			params
		})
	}

	/**
	 * 撤销用户消息
	 *
	 * @param {*} id
	 */
	revokeUserMessageApi(id:number): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/user/${id}`,
			method: 'DELETE',
		})
	}

	/**
	 * 撤销群聊消息
	 *
	 * @param {*} id
	 */
	revokeGroupMessageApi(id:number): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/${id}`,
			method: 'DELETE'
		})
	}

	/**
	 * 设置已读消息
	 * @param data
	 * @param isGroup
	 */
	readMessagesApi(
		data: { dialog_id: number | string; msg_ids: (number | string)[]; read_all?: boolean },
		isGroup?: boolean
	) {
		return request({
			///msg/group/read/set
			url: !isGroup ? `${this.baseUrl}/user/read` : `${this.baseUrl}/group/read`,
			method: 'PUT',
			data
		})
	}
}

const MsgService = new MsgServiceImpl()
export default MsgService
