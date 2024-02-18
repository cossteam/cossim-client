import type { AddFriendData, FriendListParams } from '@/types/api/relation'
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

	groupApplyListApi(params: FriendListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/group_request_list`,
			params
		})
	}
}

const RelationService = new RelationServiceImpl()

export default RelationService
