// TODO: 从 master-bak 分支对照修改接口

import { AddFriendParams, ManageFriendRequestParams, QueryParams, ShowDialogParams, TopDialogParams } from '@/types/api'
import request from '@/lib/request'

const baseUrl = '/relation/user'
const relationDialog = '/relation/dialog'
const relationGroup = '/relation/group'

/**
 * 获取好友列表
 */
export function getFriendListApi(): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend`
    })
}

/**
 * 添加好友
 *
 * @param {AddFriendParams} data
 * @returns {Promise<Object>}
 */
export function addFriendApi(data: AddFriendParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend`,
        method: 'post',
        data
    })
}

/**
 * 好友申请列表
 *
 * @param {QueryParams} params
 */
export function friendRequestListApi(params: QueryParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend_request`,
        params
    })
}

/**
 * 群聊申请列表
 *
 * @param {QueryParams} params -API 调用的参数
 */
export function groupRuestListApi(params: QueryParams): Promise<ResponseData> {
    return request({
        url: `${relationGroup}/request`,
        params
    })
}

/**
 * 删除好友请求
 *
 * @param {number} id
 * @returns
 */
export function deleteFriendRequestApi(id: number): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend_request/${id}`,
        method: 'DELETE'
    })
}

/**
 * 删除群组请求
 * @param {string} id
 * @returns
 */
export function deleteGroupApplyApi(id: string): Promise<ResponseData> {
    return request({
        url: `${relationGroup}/request/${id}`,
        method: 'DELETE'
    })
}

/**
 * 管理好友请求
 *
 * @param {number} id
 * @param {ManageFriendRequestParams} data
 */
export function manageFriendApplyApi(id: number, data: ManageFriendRequestParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend_request/${id}`,
        method: 'PUT',
        data
    })
}

/**
 * 删除好友
 *
 * @param {String} user_id
 */
export function deleteFriendApi(user_id: string): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/friend/${user_id}`,
        method: 'DELETE'
    })
}

// /**
//  * 添加黑名单
//  * @param {Object} data
//  * @param {String} data.user_id         添加到黑名单的用户id
//  * @returns {Promise<Object>}
//  */
// export function addBlackListApi(data: BlackListData): Promise<ResponseData> {
//     console.log('addBlackListApi', data)
//     return request({
//         url: `${baseUrl}/blacklist`,
//         method: 'POST',
//         data
//     })
// }

// /**
//  * 删除黑名单
//  *
//  * @param {Object} data
//  * @param {String} data.user_id         要从黑名单中移除的用户的id
//  * @returns {Promise<Object>}
//  */
// export function deleteBlackListApi(data: BlackListData): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/blacklist/${data.user_id}`,
//         method: 'DELETE',
//         data
//     })
// }

// /**
//  * 获取黑名单列表
//  */
// export function getBlackList(): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/blacklist`,
//         method: 'GET'
//     })
// }

// /**
//  * 设置用户消息静默通知
//  *
//  * @param {Object} data
//  * @param {String} data.user_id
//  * @param {String} data.silent
//  */
// export function setSilenceApi(data: SilenceData): Promise<ResponseData> {
//     const { user_id, ...requestData } = data
//     return request({
//         url: `${baseUrl}/friend/${user_id}/silent`,
//         method: 'POST',
//         data: requestData
//     })
// }

// /**
//  * 设置用户阅后即焚
//  *
//  *
//  */
// export function setBurnApi(data: BurnData): Promise<ResponseData> {
//     const { user_id, ...requestData } = data
//     return request({
//         url: `${baseUrl}/friend/${user_id}/burn`,
//         method: 'POST',
//         data: requestData
//     })
// }

/**
 * 是否置顶对话(top: false:关闭取消置顶对话, true:置顶对话)
 *
 * @param {number} dialog_id
 * @param {TopDialogParams} data
 * @returns
 */
export function topDialogApi(dialog_id: number, data: TopDialogParams): Promise<ResponseData> {
    return request({
        url: `${relationDialog}/${dialog_id}/top`,
        method: 'POST',
        data
    })
}

/**
 * 关闭或打开对话(show: false:关闭对话, true:打开对话)
 *
 * @param {number} dialog_id
 * @param {ShowDialogParams} data
 * @returns
 */
export function showDialogApi(dialog_id: number, data: ShowDialogParams): Promise<ResponseData> {
    return request({
        url: `${relationDialog}/${dialog_id}/show`,
        method: 'POST',
        data
    })
}

// /**
//  * 创建群公告
//  *
//  * @param data
//  * @param {number} data.group_id
//  * @param {string} data.content
//  * @returns
//  */
// export function createGroupNoticeApi(data: {
//     group_id: number
//     content: string
//     title: string
// }): Promise<ResponseData> {
//     const { group_id, ...requestData } = data
//     return request({
//         url: `${relationGroup}/${group_id}/announcement`,
//         method: 'POST',
//         data: requestData
//     })
// }

// /**
//  * 设置阅后即焚的时间
//  *
//  * @param data
//  * @param {string} data.friend_id
//  * @param {number} data.timeout 阅后即焚时间 (单位秒)
//  * @returns
//  */
// export function setBurnTimeApi(data: { friend_id: string; timeout: number }): Promise<ResponseData> {
//     const { friend_id, ...requestData } = data
//     return request({
//         url: `${baseUrl}/friend/${friend_id}/burn`,
//         method: 'POST',
//         data: requestData
//     })
// }

// /**
//  * 设置用户在群聊的昵称
//  * @param data
//  * @returns
//  */
// export function setGroupUserDisplayName(data: { group_id: number; remark: string }): Promise<ResponseData> {
//     const { group_id, ...requestData } = data
//     return request({
//         url: `${relationGroup}/${group_id}/remark`,
//         method: 'PUT',
//         data: requestData
//     })
// }

// /**
//  * 设置好友备注
//  * @param data
//  * @param data.user_id 好友id
//  * @param data.remark 备注内容
//  * @returns
//  */
// export function setUserRemark(data: { remark: string; user_id: string }): Promise<ResponseData> {
//     const { user_id, ...requestData } = data
//     return request({
//         url: `${baseUrl}/friend/${user_id}/remark`,
//         method: 'POST',
//         data: requestData
//     })
// }

// /**
//  * 添加入群申请
//  * @param groupId
//  * @param remark 申请备注
//  */
// export function addGruop(groupId: number, remark: string): Promise<ResponseData> {
//     return request({
//         url: `${relationGroup}/${groupId}/request`,
//         method: 'POST',
//         data: { remark: remark }
//     })
// }
