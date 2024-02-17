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
			url: `${this.baseUrl}/create`,
			method: 'POST',
			data
		})
	}

	// /**
	//  * 加入群聊
	//  * @param {*} data
	//  * @param {*} data.group_id
	//  * @returns
	//  */
	// export function joinGroupApi(data) {
	// 	return request({
	// 		url: relationGroup + '/join',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 邀请加入群聊
	//  * @param {*} data
	//  * @param {String} data.group_id
	//  * @param {Array} data.member
	//  * @returns
	//  */
	// export function groupInviteMemberApi(data) {
	// 	return request({
	// 		url: relationGroup + '/invite',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 获取群申请列表
	//  * @param {*} params
	//  * @returns
	//  */
	// export function groupRequestListApi(params) {
	// 	return request({
	// 		url: relationGroup + '/request_list',
	// 		method: 'GET',
	// 		params
	// 	})
	// }

	// /**
	//  * 管理加入群聊
	//  * @param {*} data
	//  * @returns
	//  */
	// export function confirmAddGroupApi(data) {
	// 	return request({
	// 		url: relationGroup + '/manage_join',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 获取群聊列表
	//  * @param {*} param
	//  * @returns
	//  */
	// export function groupListApi(param) {
	// 	return request({
	// 		url: relationGroup + '/list',
	// 		method: 'GET',
	// 		params: param
	// 	})
	// }

	// /**
	//  * 获取群聊信息
	//  * @param {*} param
	//  * @param {*} param.group_id
	//  * @returns
	//  */
	// export function groupInfoApi(param) {
	// 	return request({
	// 		url: group + '/info',
	// 		method: 'GET',
	// 		params: param
	// 	})
	// }

	// /**
	//  * 获取群成员列表
	//  * @param {*} param
	//  * @param {*} param.group_id
	//  * @returns
	//  */
	// export function groupMemberApi(param) {
	// 	return request({
	// 		url: relationGroup + '/member',
	// 		method: 'GET',
	// 		params: param
	// 	})
	// }

	// /**
	//  * 邀请加入群聊
	//  * @param {*} data
	//  * @param {*} data.group_id
	//  * @param {*} data.member
	//  * @returns
	//  */
	// export function groupInviteApi(data) {
	// 	return request({
	// 		url: relationGroup + '/invite',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 将用户从群聊移除
	//  * @param {*} data
	//  * @param {*} data.group_id
	//  * @param {*} data.member
	//  * @returns
	//  */
	// export function groupRemoveApi(data) {
	// 	return request({
	// 		url: relationGroup + '/admin/manage/remove',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 退出群聊
	//  * @param {*} data
	//  * @param {*} data.group_id
	//  * @returns
	//  */
	// export function groupQuitApi(data) {
	// 	return request({
	// 		url: relationGroup + '/quit',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 解散群聊
	//  * @param {*} data
	//  * @param {*} data.gid
	//  * @returns
	//  */
	// export function groupDissolve(data) {
	// 	return request({
	// 		url: group + '/delete',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	// /**
	//  * 设置群聊消息静默通知
	//  * @param {Object} data
	//  * @param {String} data.group_id
	//  * @param {String} data.is_silence
	//  */
	// export function setGroupSilenceApi(data) {
	// 	return request({
	// 		url: `${relationGroup}/silent`,
	// 		method: 'POST',
	// 		data
	// 	})
	// }
}

const GroupService = new GroupServiceImpl()

export default GroupService
