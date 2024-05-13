/**
 * @description 这里主要处理页面首次进入或激活后需要做的操作
 * @author YuHong
 * @Date 2024.3.18 14:11
 */
import useCacheStore from '@/stores/cache'
import MsgService from '@/api/msg'
import useUserStore from './stores/user'
import {
	CACHE_MESSAGE,
	CACHE_TOTAL_MESSAGE,
	MESSAGE_READ,
	MESSAGE_SEND,
	TOKEN,
	decrypt,
	isLastMessage,
	msgType,
	savePublicKey,
	updateDialog
} from './shared'
import useMessageStore from './stores/message'
import { generateMessage } from './utils/data'
import cacheStore from './utils/cache'
import GroupService from './api/group'
import RelationService from './api/relation'
import _, { get } from 'lodash-es'
import DOMPurify from 'dompurify'
import localNotification, { LocalNotificationType } from './utils/notification'
import { hasCookie } from './utils/cookie'
import { mergeMessage, revokeMessage } from './components/Message/script/message'

/**
 * 更新本地缓存消息，如果一开始没有消息，就添加会话中的最后一条消息
 *
 * @param dialogs 会话列表
 */
// async function updateCacheMessage(dialogs: any[]) {
// 	for (let i = 0; i < dialogs.length; i++) {
// 		const item = dialogs[i]
// 		const tableName = `${item.dialog_id}`
// 		const tableData = (await cacheStore.get(tableName)) ?? []
// 		if (!tableData.length) {
// 			cacheStore.set(tableName, [{ ...item?.last_message, dialog_id: item?.dialog_id }])
// 		}
// 	}
// }

/**
 * 获取远程会话
 */
export async function getRemoteSession() {
	try {
		const { code, data } = await MsgService.getDialogApi({ page_num: 1, page_size: 15 })
		if (code !== 200) return

		const cacheStore = useCacheStore.getState()

		const dialogs = []

		for (let i = 0; i < data?.list.length; i++) {
			const item = data?.list[i]
			let content = ''
			try {
				// 解密消息
				content = item?.user_id
					? await decrypt(item?.user_id, item?.last_message?.content)
					: item?.last_message?.content
			} catch (error) {
				content = item?.last_message?.content
			}

			dialogs.push({ ...item, last_message: { ...item.last_message, content } })
		}

		// 未读消息数
		const unreadCount = dialogs.reduce((prev: number, curr: any) => prev + curr?.dialog_unread_count, 0)

		if (!cacheStore.cacheDialogs.length) getBehindMessage(dialogs)

		// 更新缓存
		cacheStore.updateCacheDialogs(dialogs)
		cacheStore.updateCacheUnreadCount(unreadCount)

		// updateCacheMessage(dialogs)
	} catch (error) {
		console.error('获取远程会话失败：', error)
	}
}

/**
 * 获取申请列表
 */
export async function getApplyList() {
	try {
		const userStore = useUserStore.getState()
		const cacheStore = useCacheStore.getState()
		// 获取申请列表
		const friend = await RelationService.friendApplyListApi({ user_id: userStore.userId })
		const group = await GroupService.groupRequestListApi({ user_id: userStore.userId })

		const friendApply: any = []
		const groupApply: any = []
		friend.data && friendApply.push(...(get(friend, 'data.list', []) ?? []))
		group.data && groupApply.push(...(get(group, 'data.list', []) ?? []))
		// 统计未读数
		const len: number = [...friendApply, ...groupApply].filter(
			(v) => [0, 4].includes(v?.status) && v?.sender_id !== userStore.userId
		).length
		friendApply.sort((a: any, b: any) => b.create_at - a.create_at)
		groupApply.sort((a: any, b: any) => b.create_at - a.create_at)
		// 缓存申请列表
		cacheStore.update({
			friendApply,
			groupApply
		})

		// 未读长度
		cacheStore.updateCacheApplyCount(len)
	} catch (error) {
		console.error('获取申请列表', error)
	}
}

/**
 * 获取落后消息
 * @param {any[]} dialogs 本地缓存的会话列表
 */
export async function getBehindMessage(dialogs?: any[]) {
	try {
		const cacheStore = useCacheStore.getState()
		const dialogsData = dialogs ?? cacheStore.cacheDialogs
		const params = dialogsData.map((v) => ({
			dialog_id: v?.dialog_id,
			msg_id: dialogs ? 0 : v?.last_message?.msg_id ?? 0
		}))
		const { code, data } = await MsgService.getBehindMessageApi(params)
		if (code !== 200) return
		console.log('落后消息', data)
		// 更新本地缓存消息
		cacheStore.updateBehindMessage(data)
		const totalMessages = data.map((v: any) => ({ dialog_id: v.dialog_id, total: v.total }))
		cacheStore.set(CACHE_TOTAL_MESSAGE, totalMessages, true)
	} catch (error) {
		console.error('获取落后消息失败：', error)
	}
}

/**
 * 获取好友列表
 */
export async function getFriendList() {
	try {
		const userStore = useUserStore.getState()
		const cacheStore = useCacheStore.getState()
		const { code, data } = await RelationService.getFriendListApi({ user_id: userStore.userId })
		if (code !== 200) return
		// console.log('好友申请列表', data)
		cacheStore.updateCacheContacts(data)
	} catch (error) {
		console.error('获取好友列表', error)
	}
}

/**
 * 获取群聊列表
 */
export async function getGroupList() {
	try {
		const cacheStore = useCacheStore.getState()
		const { code, data } = await GroupService.groupListApi()
		if (code !== 200) return
		cacheStore.updateCacheGroups(data)
	} catch (error) {
		console.error('获取群聊列表', error)
	}
}

/**
 * 是否需要根据消息类型来确定是否需要添加或更新消息，标注、取消标注消息
 * @param type 	消息类型
 */
function isLableMessage(type: msgType) {
	return [msgType.LABEL, msgType.CANCEL_LABEL].includes(type)
}

/**
 * 是否需要根据消息类型来确定是否需要添加或更新消息, 撤回消息
 *
 * @param type 	消息类型
 */
function isRecallMessage(type: msgType) {
	return type === msgType.RECALL
}

/**
 * 更新本地缓存的标注消息
 * @param {any} message	消息
 */
async function updateLabelCacheMessage(message: any) {
	const tableName = CACHE_MESSAGE + `_${message.dialog_id}`
	const messages = (await cacheStore.get(tableName)) ?? []
	const index = messages.findIndex((item: any) => item.msg_id === message?.reply_id)
	if (index === -1) return
	messages[index] = { ...messages[index], ...message }
	cacheStore.set(tableName, messages)
}

/**
 * 撤回消息，删除本地的消息
 * @param {message} message	消息
 */
async function updateRecallCacheMessage(message: any) {
	const tableName = CACHE_MESSAGE + `_${message.dialog_id}`
	const messages = (await cacheStore.get(tableName)) ?? []
	const data = messages.filter((v: any) => v.msg_id === message?.msg_id)
	cacheStore.set(tableName, data)
}

/**
 * 处理消息
 * @param {any} data 推送消息
 */
export async function handlerSocketMessage(data: any) {
	// console.log('handlerSocketMessage', data)
	const userStore = useUserStore.getState()
	const messageStore = useMessageStore.getState()
	const cacheStore = useCacheStore.getState()

	// 获取消息
	const message = data?.data || {}
	// 获取消息类型
	const type = message?.msg_type

	// 是否需要继续操作，如果是标注、撤回时需要继续操作,如果都不是且是自己当前设备发的就不处理
	const isDrivered: boolean = userStore.deviceId === (data?.driver_id ?? data?.driverId)
	const isContinue = !isLableMessage(type) && !isRecallMessage(type) && isDrivered
	//如果是自己发的消息，则不处理
	const isMe: boolean = userStore.userId === message?.sender_id
	if (isContinue && isMe) return

	const msg = generateMessage({
		...message,
		is_label: type === msgType.LABEL ? true : false,
		msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
		is_read: isDrivered ? MESSAGE_READ.READ : MESSAGE_READ.NOT_READ
	})

	console.log('msg', isDrivered, msg)

	msg.content = await decrypt(message?.sender_id, message.content)

	// TODO: 解密标注消息
	if (isLableMessage(type)) {
		const replyMessage = msg.reply_msg
		if (!replyMessage) return
		const senderId = replyMessage?.sender_id === userStore.userId ? message?.receiver_id : replyMessage?.sender_id
		console.log('解密标注消息用户 ID ->', senderId)
		msg.reply_msg.content = await decrypt(senderId, replyMessage.content)
	}

	// 本地通知
	try {
		// msg 的发送者不是自己并且当前不在会话中
		const dialogId = Number(messageStore.dialogId)
		if (Number(message.dialog_id) !== dialogId) {
			// 本地通知
			const dom = document.createElement('p')
			dom.innerHTML = DOMPurify.sanitize(msg.content || '')
			localNotification(LocalNotificationType.MESSAGE, msg.sender_info.name, dom.innerText)
		}
	} catch {
		console.log('发送本地通知失败')
	}

	// 如果是当前会话，需要实时更新到页面
	if (message?.dialog_id === messageStore.dialogId) {
		await messageStore.createMessage(msg)

		// 更新标注消息
		if (isLableMessage(type)) {
			// 需要拿到最新的消息列表
			const messageStore = useMessageStore.getState()
			const messages = messageStore.allMessages?.find((v) => v?.msg_id === msg?.reply_id)
			messages &&
				messageStore.updateMessage({
					...messages,
					is_label: type === msgType.LABEL ? true : false
				})
		}

		// 更新撤回消息
		if (isRecallMessage(type)) {
			const relpyMsg = msg.reply_msg
			const messageStore = useMessageStore.getState()
			const message = messageStore.allMessages?.find((v) => v?.msg_id === msg?.reply_id)

			if (relpyMsg.msg_type === msgType.EMOJI) {
				revokeMessage(relpyMsg)
			} else {
				// 需要拿到最新的消息列表
				message && messageStore.deleteMessage(message)
			}
		}
	} else {
		cacheStore.addCacheMessage(msg)
	}

	// 如果是标注消息，需要修改本地消息缓存
	isLableMessage(type) && updateLabelCacheMessage(msg)
	// 如果是撤回消息，需要修改本地消息缓存
	isRecallMessage(type) && updateRecallCacheMessage(msg)

	// 更新消息的总未读数
	if (msg.is_read !== MESSAGE_READ.READ) cacheStore.updateCacheUnreadCount(cacheStore.unreadCount + 1)

	// 如果是表情回复，就合并消息
	if (message.msg_type === msgType.EMOJI) mergeMessage(msg)

	// 更新会话的未读数
	cacheStore.updateCacheDialogs(
		cacheStore.cacheDialogs.map((i) => {
			if (i.dialog_id === message.dialog_id) {
				return {
					...i,
					dialog_unread_count: ++i.dialog_unread_count
				}
			}
			return i
		})
	)

	// 更新本地会话
	await updateDialog(msg, msg.dialog_id)
}

/**
 * 编辑消息
 * @param {any} data
 */
export async function handlerSocketEdit(data: any) {
	const userStore = useUserStore.getState()
	if (userStore.deviceId === data.driverId) return

	const cacheStore = useCacheStore.getState()
	const messageStore = useMessageStore.getState()

	const message = data.data

	const msg = {
		msg_id: message?.id ?? message?.msg_id,
		content: message.content,
		dialog_id: message.dialog_id
	}

	// 如果是当前会话，需要实时更新到页面
	if (message?.dialog_id === messageStore.dialogId) {
		await messageStore.updateMessage(msg)
	} else {
		await cacheStore.updateCacheMessage(msg)
	}

	// 更新本地会话
	if (isLastMessage(msg)) updateDialog(message, message.dialog_id)
}

/**
 * 处理好友请求
 * @param data
 */
export function handlerSocketRequest(data: any) {
	// 修改未处理请求数
	const cacheStore = useCacheStore.getState()
	cacheStore.updateCacheApplyCount(cacheStore.applyCount + 1)
	// 保存公钥以及通知
	try {
		if (data?.data?.user_id) {
			savePublicKey(data?.data?.user_id, data?.data?.e2e_public_key)
		}
		localNotification(LocalNotificationType.MESSAGE, '新请求', data.msg ?? '有新的请求待处理')
	} catch (e) {
		console.error('新请求异常', e)
	}
}

/**
 * 处理好友同意或者拒绝
 */
export function handlerSocketResult(data: any) {
	console.log('好友同意或拒绝', data)
	try {
		localNotification(
			LocalNotificationType.MESSAGE,
			'处理结果',
			`${data.target_info.nickname}${data.status ? '同意' : '拒绝'}了你的申请`
		)
	} catch {
		console.log('发送本地通知失败')
	}
	getRemoteSession()
}

/**
 * 计算两个时间戳之间的差值（以秒为单位）
 * @param timestamp1
 * @param timestamp2
 * @returns
 */
function diffInSeconds(timestamp1: number, timestamp2: number) {
	const diffInMilliseconds = Math.abs(timestamp1 - timestamp2)
	return Math.floor(diffInMilliseconds / 1000)
}

// 检查两个时间戳是否相差超过指定的秒数
function isDifferenceGreaterThanSeconds(timestamp1: number, timestamp2: number, seconds: number) {
	const diff = diffInSeconds(timestamp1, timestamp2)
	return diff > seconds
}

/**
//  * 阅后即焚(临时使用，后续渲染每一条消息之前判断时候已读并且已过期)
 * @param data
 */
export const handlerDestroyMessage = _.debounce(() => {
	// console.log('处理阅后即焚')
	const cacheStore = useCacheStore.getState()
	const messageStore = useMessageStore.getState()
	// 查找每一个开启阅后即焚设置的会话
	cacheStore.cacheContacts.map(async (item) => {
		const preferences = {
			dialog_id: item.dialog_id,
			..._.pick(item, ['preferences']).preferences
		}
		if (!preferences.open_burn_after_reading) return
		// console.log(
		// 	`会话【${preferences.dialog_id}】${preferences.open_burn_after_reading ? '已开启阅后即焚' : '已关闭阅后即焚'}`,
		// 	`${preferences.open_burn_after_reading_time_out}s`,
		// 	item
		// )
		// 遍历消息列表，查找开启阅后即焚以后已读的消息
		const allMsg = await cacheStore.get(`${item.dialog_id}`)
		// console.log(
		// 	// '已读且超时',
		// 	`未读(${item.dialog_id})`,
		// 	allMsg.filter(
		// 		(i: any) =>
		// 			i.is_read === MESSAGE_READ.NOT_READ ||
		// 	!isDifferenceGreaterThanSeconds(i.read_at, Date.now(), preferences.open_burn_after_reading_time_out)
		// 	)
		// )

		await cacheStore.set(
			`${item.dialog_id}`,
			// 保留未读消息
			allMsg.filter((i: any) => {
				const readAndTimeout = isDifferenceGreaterThanSeconds(
					i.read_at,
					Date.now(),
					preferences.open_burn_after_reading_time_out
				)
				if (readAndTimeout) {
					// 删除已读且且超时的消息
					messageStore.deleteMessage(i)
					// 删除会回最后一条消息数据
					// const dialogs = cacheStore.cacheDialogs.map((j) => {
					// 	if (j.dialog_id === item.dialog_id) {
					// 		j.last_message.content = ''
					// 	}
					// })
					// console.log(dialogs)
					// cacheStore.updateCacheDialogs(dialogs)
				}
				return i.is_read === MESSAGE_READ.NOT_READ || !readAndTimeout
			})
		)
	})
}, 1000)

/**
 * 用户在线状态
 * @param data 推送消息
 */
export function handlerSocketOnline(data: any) {
	// const userStore = useUserStore.getState()
	// console.log('用户在线状态d', data)
	const cacheStore = useCacheStore.getState()
	cacheStore.update({ onlineStatus: data.data }, true)
}

/**
 * 主入口
 */
function run() {
	const cacheStore = useCacheStore.getState()

	// 订阅 firstOpened 状态
	useCacheStore.subscribe(async ({ firstOpened }) => {
		if (firstOpened && hasCookie(TOKEN)) {
			getRemoteSession()
			// getBehindMessage() // 获取落后消息
			getApplyList()
			getFriendList()
			getGroupList()
			// setInterval(() => {
			// 	handlerDestroyMessage() // 阅后即焚
			// }, 2000)
			cacheStore.updateFirstOpened(false)
		}
	})
}

export default run
