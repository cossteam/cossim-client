import type {
	AddFriendData,
	BlackListData,
	BurnData,
	FriendListParams,
	ManageFriendData,
	SilenceData
} from '@/types/api/relation'
import request from '@/utils/request'

class RelationServiceImpl {
	private baseUrl: string = '/relation/user'
	private relationDialog: string = '/relation/dialog'
	private relationGroup: string = '/relation/group'

	/**
	 * 获取好友列表
	 *
	 * @param {FriendListParams} params.user_id
	 */
	getFriendListApi(params?: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/friend`
			// params
		})
	}

	/**
	 * 添加好友
	 *
	 * @param {Object} data
	 * @param {String} data.user_id         添加对面的用户 id
	 * @param {String} data.msg       		添加消息
	 * @param {String} data.e2e_public_key  公钥
	 * @returns {Promise<Object>}
	 */
	addFriendApi(data: AddFriendData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/friend`,
			method: 'post',
			data
		})
	}

	/**
	 * 好友申请列表
	 *
	 * @param {FriendListParams} params -API 请求的参数
	 * @param {FriendListParams} params.page_num 页码
	 * @param {FriendListParams} params.page_size 页大小
	 * @return {Promise<DataResponse>}
	 */
	friendApplyListApi(params: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/friend_request`
			// params
		})
	}

	/**
	 * 执行组请求列表 API 调用。
	 *
	 * @param {FriendListParams} params -API 调用的参数
	 * @return {Promise<DataResponse>} 解析为 API 响应数据的 Promise
	 */
	groupApplyListApi(params: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group_request_list`,
			params
		})
	}

	/**
	 * 删除好友请求 API 调用。
	 * @param data.id
	 * @returns
	 */
	deleteFriendApplyApi(data: any): Promise<DataResponse> {
		const { id } = data
		return request({
			url: `${this.baseUrl}/friend_request/${id}`,
			method: 'DELETE'
		})
	}

	/**
	 * 删除群组请求 API 调用。
	 * @param data.id
	 * @returns
	 */
	deleteGroupApplyApi(data: any): Promise<DataResponse> {
		return request({
			url: `${this.relationGroup}/request/${data.id}`,
			method: 'DELETE'
		})
	}

	/**
	 * 管理好友请求
	 *
	 * @param {ManageFriendData} data
	 */
	manageFriendApplyApi(data: ManageFriendData): Promise<DataResponse> {
		const { request_id, ...requestData } = data
		return request({
			url: `${this.baseUrl}/friend_request/${request_id}`,
			method: 'PUT',
			data: requestData
		})
	}

	/**
	 * 删除好友
	 *
	 * @param {String} user_id
	 */
	deleteFriendApi(user_id: string): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/friend/${user_id}`,
			method: 'DELETE'
		})
	}

	/**
	 * 添加黑名单
	 * @param {Object} data
	 * @param {String} data.user_id         添加到黑名单的用户id
	 * @returns {Promise<Object>}
	 */
	addBlackListApi(data: BlackListData): Promise<DataResponse> {
		console.log('addBlackListApi', data)
		return request({
			url: `${this.baseUrl}/blacklist`,
			method: 'POST',
			data
		})
	}

	/**
	 * 删除黑名单
	 *
	 * @param {Object} data
	 * @param {String} data.user_id         要从黑名单中移除的用户的id
	 * @returns {Promise<Object>}
	 */
	deleteBlackListApi(data: BlackListData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/blacklist/${data.user_id}`,
			method: 'DELETE',
			data
		})
	}

	/**
	 * 获取黑名单列表
	 */
	getBlackList(): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/blacklist`,
			method: 'GET'
		})
	}

	/**
	 * 设置用户消息静默通知
	 *
	 * @param {Object} data
	 * @param {String} data.user_id
	 * @param {String} data.silent
	 */
	setSilenceApi(data: SilenceData): Promise<DataResponse> {
		const { user_id, ...requestData } = data
		return request({
			url: `${this.baseUrl}/friend/${user_id}/silent`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 设置用户阅后即焚
	 *
	 *
	 */
	setBurnApi(data: BurnData): Promise<DataResponse> {
		const { user_id, ...requestData } = data
		return request({
			url: `${this.baseUrl}/friend/${user_id}/burn`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 是否置顶对话(top: false:关闭取消置顶对话, true:置顶对话)
	 * @param data
	 * @param {number} data.dialog_id
	 * @param {number} data.top
	 * @returns
	 */
	topDialogApi(data: { dialog_id: number; top: boolean }): Promise<DataResponse> {
		const { dialog_id, ...requestData } = data
		return request({
			url: `${this.relationDialog}/${dialog_id}/top`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 关闭或打开对话(show: false:关闭对话, true:打开对话)
	 * @param data
	 * @param {number} data.dialog_id
	 * @param {number} data.action
	 * @returns
	 */
	showDialogApi(data: { dialog_id: number; show: boolean }): Promise<DataResponse> {
		const { dialog_id, ...requestData } = data
		return request({
			url: `${this.relationDialog}/${dialog_id}/show`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 创建群公告
	 *
	 * @param data
	 * @param {number} data.group_id
	 * @param {string} data.content
	 * @returns
	 */
	createGroupNoticeApi(data: { group_id: number; content: string; title: string }): Promise<DataResponse> {
		const { group_id, ...requestData } = data
		return request({
			url: `${this.relationGroup}/${group_id}/announcement`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 设置阅后即焚的时间
	 *
	 * @param data
	 * @param {string} data.friend_id
	 * @param {number} data.timeout 阅后即焚时间 (单位秒)
	 * @returns
	 */
	setBurnTimeApi(data: { friend_id: string; timeout: number }): Promise<DataResponse> {
		const { friend_id, ...requestData } = data
		return request({
			url: `${this.baseUrl}/friend/${friend_id}/burn`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 设置用户在群聊的昵称
	 * @param data
	 * @returns
	 */
	setGroupUserDisplayName(data: { group_id: number; remark: string }): Promise<DataResponse> {
		const { group_id, ...requestData } = data
		return request({
			url: `${this.relationGroup}/${group_id}/remark`,
			method: 'PUT',
			data: requestData
		})
	}

	/**
	 * 设置好友备注
	 * @param data
	 * @param data.user_id 好友id
	 * @param data.remark 备注内容
	 * @returns
	 */
	setUserRemark(data: { remark: string; user_id: string }): Promise<DataResponse> {
		const { user_id, ...requestData } = data
		return request({
			url: `${this.baseUrl}/friend/${user_id}/remark`,
			method: 'POST',
			data: requestData
		})
	}

	/**
	 * 添加入群申请
	 * @param groupId
	 * @param remark 申请备注
	 */
	addGruop(groupId: number, remark: string): Promise<DataResponse> {
		return request({
			url: `${this.relationGroup}/${groupId}/request`,
			method: 'POST',
			data: { remark: remark }
		})
	}
}

const RelationService = new RelationServiceImpl()

export default RelationService
