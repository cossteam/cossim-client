// TODO: 从 master-bak 分支对照修改接口
import request from '@/utils/request'
import { GetBehindMessagesParams, QueryParams } from '@/types/api'

const baseUrl = '/msg'

/**
 * 获取对话列表
 *
 * @returns
 */
export function getDialogListApi(params: Required<QueryParams>): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/dialog/list`,
        params
    })
}

// /**
//  * 获取私聊消息列表
//  *
//  * @returns
//  */
// export function getUserMessageListApi(params: MessageListParams): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/list`,
//         params
//     })
// }

// /**
//  * 发送私聊消息
//  * @param {*} data
//  * @param {*} data.content          内容
//  * @param {*} data.receiver_id      接收者id
//  * @param {*} data.replay_id        回复id
//  * @param {*} data.type             消息类型
//  * @returns
//  */
// export function sendUserMessageApi(data: SendMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/send`,
//         method: 'POST',
//         data
//     })
// }

// /**
//  * 发送群聊消息
//  * @param {*} data
//  * @param {*} data.content          内容
//  * @param {*} data.receiver_id      接收者id
//  * @param {*} data.replay_id        回复id
//  * @param {*} data.type             消息类型
//  * @returns
//  */
// export function sendGroupMessageApi(data: SendGroupMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/send`,
//         method: 'POST',
//         data
//     })
// }

// /**
//  * 编辑用户信息
//  * @param {*} data
//  * @param {string} data.content		消息
//  * @param {number} id		消息id
//  * @param {number} data.msg_type	消息类型
//  */
// export function editUserMessageApi(id: number, data: EditMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/${id}`,
//         method: 'PUT',
//         data
//     })
// }

// /**
//  * 编辑群聊消息
//  * @param {*} data
//  * @param {*} data.content			消息内容
//  * @param {*} id			消息id
//  * @param {*} data.type				消息类型
//  */
// export function editGroupMessageApi(id: number, data: EditMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/${id}`,
//         method: 'PUT',
//         data
//     })
// }

// /**
//  * 标注私聊消息
//  * @param {*} data
//  * @param {*} id			消息id
//  * @param {*} data.is_label			是否标记
//  */
// export function labelUserMessageApi(id: number, data: LabelMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/${id}/label`,
//         method: 'POST',
//         data
//     })
// }

// /**
//  * 标注群聊消息
//  * @param {*} data
//  * @param {*} id			消息id
//  * @param {*} data.is_label			是否标记
//  */
// export function labelGroupMessageApi(id: number, data: LabelMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/${id}/label`,
//         method: 'POST',
//         data
//     })
// }

// /**
//  * 批量设置群聊消息已读
//  * @param {*} data
//  * @param {*} data.msg_ids			消息id列表
//  * @param {*} data.dialog_id		对话id
//  */
// export function readGroupMessageApi(data: ReadMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/read`,
//         method: 'PUT',
//         data
//     })
// }

// /**
//  * 批量设置私聊消息已读
//  * @param {*} data
//  * @param {*} data.msg_ids			消息id列表
//  * @param {*} data.dialog_id		对话id
//  */
// export function readUserMessageApi(data: ReadMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/read`,
//         method: 'PUT',
//         data
//     })
// }

/**
 * 获取指定对话落后的消息
 *
 * @param {*} data
 * @param {*} data.dialog_id
 * @param {*} data.msg_id
 */
export function getBehindMessageApi(data: GetBehindMessagesParams[]): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/dialog/after`,
        method: 'POST',
        data
    })
}

// /**
//  * 获取私聊消息
//  *
//  * @param {GetMessage} params
//  */
// export function getUserMessageApi(params: GetMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/list`,
//         params
//     })
// }

// /**
//  * 获取群聊消息
//  *
//  * @param {GetGroupMessage} params
//  */
// export function getGroupMessageApi(params: GetGroupMessage): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/list`,
//         params
//     })
// }

// /**
//  * 撤销用户消息
//  *
//  * @param {*} id
//  */
// export function revokeUserMessageApi(id: number): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/user/${id}`,
//         method: 'DELETE'
//     })
// }

// /**
//  * 撤销群聊消息
//  *
//  * @param {*} id
//  */
// export function revokeGroupMessageApi(id: number): Promise<ResponseData> {
//     return request({
//         url: `${baseUrl}/group/${id}`,
//         method: 'DELETE'
//     })
// }

// /**
//  * 设置已读消息
//  * @param data
//  * @param isGroup
//  */
// // readMessagesApi(
// // 	data: { dialog_id: number | string; msg_ids: (number | string)[]; read_all?: boolean },
// // 	isGroup?: boolean
// // ) {
// // 	return request({
// // 		///msg/group/read/set
// // 		url: !isGroup ? `${baseUrl}/user/read` : `${baseUrl}/group/read`,
// // 		method: 'PUT',
// // 		data
// // 	})
// // }
