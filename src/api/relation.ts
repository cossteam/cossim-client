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

	/**
	 * 获取好友列表
	 *
	 * @param {FriendListParams} params.user_id
	 */
	getFriendListApi(params?: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/friend_list`,
			params
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
			url: `${this.baseUrl}/add_friend`,
			method: 'post',
			data
		})
	}

	/**
	 * 好友申请列表
	 *
	 * @param {FriendListParams} params -API 请求的参数
	 * @return {Promise<DataResponse>} 包含 API 响应数据的 Promise
	 */
	friendApplyListApi(params: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/request_list`,
			params
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
	 * 管理好友请求
	 *
	 * @param {ManageFriendData} data
	 */
	manageFriendApplyApi(data: ManageFriendData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/manage_friend`,
			method: 'post',
			data
		})
	}

	/**
	 * 删除好友
	 *
	 * @param {String} user_id
	 */
	deleteFriendApi(user_id: string): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/delete_friend`,
			method: 'post',
			data: {
				user_id
			}
		})
	}

	/**
	 * 添加黑名单
	 * @param {Object} data
	 * @param {String} data.user_id         用户id
	 * @param {String} data.friend_id       好友id
	 * @returns {Promise<Object>}
	 */
	addBlackListApi(data: BlackListData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/add_blacklist`,
			method: 'post',
			data
		})
	}

	/**
	 * 删除黑名单
	 *
	 * @param {Object} data
	 * @param {String} data.user_id         用户id
	 * @param {String} data.friend_id       好友id
	 * @returns {Promise<Object>}
	 */
	deleteBlackListApi(data: BlackListData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/delete_blacklist`,
			method: 'post',
			data
		})
	}

	/**
	 * 设置用户消息静默通知
	 *
	 * @param {Object} data
	 * @param {String} data.user_id
	 * @param {String} data.is_silent
	 */
	setSilenceApi(data: SilenceData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/silent`,
			method: 'POST',
			data
		})
	}

	/**
	 * 设置用户阅后即焚
	 *
	 *
	 */
	setBurnApi(data: BurnData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/burn/open`,
			method: 'POST',
			data
		})
	}
}

const RelationService = new RelationServiceImpl()

export default RelationService
