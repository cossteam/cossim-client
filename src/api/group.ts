import type { CreateGroupData, groupListParams } from '@/types/api/group'
import request from '@/utils/request'

class GroupServiceImpl {
	private baseUrl: string = '/group'
	private baseGroupUrl: string = '/relation/group'

	/**
	 * 获取群申请列表
	 * @param {*} params
	 * @returns
	 */
	groupRequestListApi(params: groupListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseGroupUrl}/request_list`,
			method: 'GET',
			params
		})
	}

	/**
	 * 创建群聊
	 * @param {Object} data
	 * @param {String} data.avatar
	 * @param {String} data.name
	 * @param {String} data.type
	 * @param {String} data.max_members_limit
	 * @param {Array} data.member
	 */
	createGroupApi(data: CreateGroupData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}`,
			method: 'POST',
			data
		})
	}

	/**
	 * 加入群聊
	 * @param {*} data
	 * @param {*} data.group_id
	 * @returns
	 */
	joinGroupApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/join',
			method: 'POST',
			data
		})
	}

	/**
	 * 邀请加入群聊
	 * @param {*} data
	 * @param {String} data.group_id
	 * @param {Array} data.member
	 * @returns
	 */
	groupInviteMemberApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/invite',
			method: 'POST',
			data
		})
	}

	/**
	 * 管理加入群聊
	 * @param {*} data
	 * @returns
	 */
	confirmAddGroupApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/manage_join',
			method: 'POST',
			data
		})
	}

	/**
	 * 获取群聊列表
	 * @param {*} param
	 * @returns
	 */
	groupListApi(param?: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/list',
			method: 'GET',
			params: param
		})
	}

	/**
	 * 获取群聊信息
	 * @param {*} param
	 * @param {*} param.group_id
	 * @returns
	 */
	groupInfoApi(param: any): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/${param.group_id}`,
			method: 'GET',
			// params: param
		})
	}

	/**
	 * 修改群聊信息
	 * @param id
	 * @param data
	 * @returns
	 */
	groupUpdateApi(data: any): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/${data.group_id}`,
			method: 'PUT',
			data
		})
	}

	/**
	 * 获取群成员列表
	 * @param {*} param
	 * @param {*} param.group_id
	 * @returns
	 */
	groupMemberApi(param: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/member',
			method: 'GET',
			params: param
		})
	}

	/**
	 * 邀请加入群聊
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.member
	 * @returns
	 */
	groupInviteApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/invite',
			method: 'POST',
			data
		})
	}

	/**
	 * 将用户从群聊移除
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.member
	 * @returns
	 */
	groupRemoveApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/admin/manage/remove',
			method: 'POST',
			data
		})
	}

	/**
	 * 退出群聊
	 * @param {*} data
	 * @param {*} data.group_id
	 * @returns
	 */
	groupQuitApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/quit',
			method: 'POST',
			data
		})
	}

	/**
	 * 解散群聊
	 * @param {*} data
	 * @param {*} data.group_id
	 * @returns
	 */
	groupDissolve(data: any): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/${data.group_id}`,
			method: 'DELETE',
			data
		})
	}

	/**
	 * 设置群聊消息静默通知
	 * @param {Object} data
	 * @param {String} data.group_id
	 * @param {String} data.is_silence
	 */
	setGroupSilenceApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + `/silent`,
			method: 'POST',
			data
		})
	}

	/**
	 * 管理员管理进群请求
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.action
	 * @param {*} data.id
	 */
	manageGroupRequestAdminApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/admin/manage/join',
			method: 'POST',
			data
		})
	}

	/**
	 * 用户管理进群请求
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.action
	 * @param {*} data.id
	 */
	manageGroupRequestApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/manage_join',
			method: 'POST',
			data
		})
	}

	/**
	 * 管理群聊申请
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.action
	 * @param {*} data.id
	 */
	manageGroupApplyApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/manage_join',
			method: 'POST',
			data
		})
	}

	/**
	 * 获取群公告
	 *
	 * @param {*} param
	 * @param {*} param.group_id
	 * @returns
	 */
	groupAnnouncementApi(param: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/announcement/list',
			method: 'GET',
			params: param
		})
	}

	/**
	 *  创建群公告
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.title
	 * @param {*} data.content
	 * @returns
	 */
	createGroupAnnouncementApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/admin/announcement',
			method: 'POST',
			data
		})
	}

	/**
	 *  删除群公告
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.id
	 * @returns
	 */
	deleteGroupAnnouncementApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/admin/announcement/delete',
			method: 'POST',
			data
		})
	}

	/**
	 *  获取群公告详情
	 *
	 * @param {*} param
	 * @param {*} param.group_id
	 * @param {*} param.id
	 * @returns
	 */
	getGroupAnnouncementApi(params: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/announcement/detail',
			method: 'GET',
			params
		})
	}

	/**
	 *  更新群公告
	 *
	 * @param {*} data
	 * @param {*} data.group_id
	 * @param {*} data.id
	 * @param {*} data.title
	 * @param {*} data.content
	 * @returns
	 */
	updateGroupAnnouncementApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/admin/announcement/update',
			method: 'POST',
			data
		})
	}

	/**
	 * 群公告已读
	 * @param data
	 * @param {*} data.group_id
	 * @param {*} data.id
	 */
	readGroupAnnouncementApi(data: any): Promise<DataResponse> {
		return request({
			url: this.baseGroupUrl + '/announcement/read',
			method: 'POST',
			data
		})
	}
}

const GroupService = new GroupServiceImpl()

export default GroupService
