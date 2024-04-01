import type {
	EditMessage,
	GetBehindMessage,
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
	sendGroupMessageApi(data: SendGroupMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/send/group`,
			method: 'POST',
			data
		})
	}

	/**
	 * 编辑用户信息
	 * @param {*} data
	 * @param {string} data.content		消息
	 * @param {number} data.msg_id		消息id
	 * @param {number} data.msg_type	消息类型
	 */
	editUserMessageApi(data: EditMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/edit/user`,
			method: 'POST',
			data
		})
	}

	/**
	 * 编辑群聊消息
	 * @param {*} data
	 * @param {*} data.content			消息内容
	 * @param {*} data.msg_id			消息id
	 * @param {*} data.type				消息类型
	 */
	editGroupMessageApi(data: EditMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/edit/group`,
			method: 'POST',
			data
		})
	}

	/**
	 * 标注私聊消息
	 * @param {*} data
	 * @param {*} data.msg_id			消息id
	 * @param {*} data.is_label			是否标记
	 */
	labelUserMessageApi(data: LabelMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/label/user`,
			method: 'POST',
			data
		})
	}

	/**
	 * 标注群聊消息
	 * @param {*} data
	 * @param {*} data.msg_id			消息id
	 * @param {*} data.is_label			是否标记
	 */
	labelGroupMessageApi(data: LabelMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/label/group`,
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
	readGroupMessageApi(data: ReadGroupMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group/read/set`,
			method: 'POST',
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
			url: `${this.baseUrl}/read/user`,
			method: 'POST',
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
			url: `${this.baseUrl}/after/get`,
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
			url: `${this.baseUrl}/list/user`,
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
			url: `${this.baseUrl}/list/group`,
			params
		})
	}

	/**
	 * 撤销用户消息
	 *
	 * @param {*} data
	 * @param {*} data.msg_id
	 */
	revokeUserMessageApi(data: RevokeMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/recall/user`,
			method: 'POST',
			data
		})
	}

	/**
	 * 撤销群聊消息
	 *
	 * @param {*} data
	 * @param {*} data.msg_id
	 */
	revokeGroupMessageApi(data: RevokeMessage): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/recall/group`,
			method: 'POST',
			data
		})
	}

	/**
	 * 设置已读消息
	 * @param data
	 */
	readMessagesApi(data: {dialog_id: number | string, msg_ids: [], read_all?: boolean}) {
		return request({
			url: `${this.baseUrl}/read/user`,
			method: 'POST',
			data
		})
	}
}

const MsgService = new MsgServiceImpl()
export default MsgService
