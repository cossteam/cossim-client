/**
 * @description 这里主要处理页面首次进入或激活后需要做的操作
 * @author YuHong
 * @Date 2024.3.18 14:11
 */
import useCacheStore from '@/stores/cache'
import MsgService from '@/api/msg'
import useUserStore from './stores/user'
import { CACHE_MESSAGE, MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, isLastMessage, msgType, updateDialog } from './shared'
import useMessageStore from './stores/new_message'
import { generateMessage } from './utils/data'
import cacheStore from './utils/cache'
import GroupService from './api/group'
import RelationService from './api/relation'

/**
 * 更新本地缓存消息，如果一开始没有消息，就添加会话中的最后一条消息
 *
 * @param dialogs 会话列表
 */
async function updateCacheMessage(dialogs: any[]) {
	for (let i = 0; i < dialogs.length; i++) {
		const item = dialogs[i]
		const tableName = `${item.dialog_id}`
		const tableData = (await cacheStore.get(tableName)) ?? []
		if (!tableData.length) {
			cacheStore.set(tableName, [{ ...item?.last_message, dialog_id: item?.dialog_id }])
		}
	}
}

/**
 * 获取远程会话
 */
export async function getRemoteSession() {
	try {
		const { code, data } = await MsgService.getDialogApi()
		if (code !== 200) return

		const cacheStore = useCacheStore.getState()

		const dialogs = data.map((item: any) => ({
			...item,
			shareKey: cacheStore.cacheShareKeys.find((v: any) => v?.id === item?.receiver)?.shareKey ?? null
		}))

		// 未读消息数
		const unreadCount = dialogs.reduce((prev: number, curr: any) => prev + curr?.dialog_unread_count, 0)

		// 更新缓存
		cacheStore.updateCacheDialogs(dialogs)
		cacheStore.updateCacheUnreadCount(unreadCount)

		updateCacheMessage(dialogs)
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
		friend.data && friendApply.push(...friend.data)
		group.data && groupApply.push(...group.data)
		// 统计未读数
		const len = [...friendApply, ...groupApply].filter(
			(v) => [0, 4].includes(v?.status) && v?.sender_id !== userStore.userId
		).length
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
 */
export async function getBehindMessage() {
	try {
		const cacheStore = useCacheStore.getState()
		const params = cacheStore.cacheDialogs.map((v) => ({
			dialog_id: v?.dialog_id,
			msg_id: v?.last_message?.msg_id
		}))
		const { code, data } = await MsgService.getBehindMessageApi(params)
		if (code !== 200) return
		console.log('落后消息', data)
		// 更新本地缓存消息
		cacheStore.updateBehindMessage(data)
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
		console.log('好友申请列表', data)
		cacheStore.updateCacheContacts(data)
	} catch (error) {
		console.error('获取好友列表', error)
	}
}

/**
 * 是否需要根据消息类型来确定是否需要添加或更新消息，标注、取消标注消息
 *
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
 *
 * @param {any} message
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
 *
 * @param {message} message
 */
async function updateRecallCacheMessage(message: any) {
	const tableName = CACHE_MESSAGE + `_${message.dialog_id}`
	const messages = (await cacheStore.get(tableName)) ?? []
	const data = messages.filter((v: any) => v.msg_id === message?.msg_id)
	cacheStore.set(tableName, data)
}

/**
 * 处理消息
 *
 * @param {any} data	推送消息
 */
export async function handlerSocketMessage(data: any) {
	// console.log('handlerSocketMessage', data)

	const userStore = useUserStore.getState()
	const messageStore = useMessageStore.getState()
	const cacheStore = useCacheStore.getState()

	// 获取消息
	const message = data.data
	// 获取消息类型
	const type = message?.msg_type

	// 是否需要继续操作，如果是标注、撤回时需要继续操作,如果都不是且是自己当前设备发的就不处理
	const isContinue = !isLableMessage(type) && !isRecallMessage(type) && userStore.deviceId === data.driverId
	if (isContinue) return

	const msg = generateMessage({
		...message,
		is_label: type === msgType.LABEL ? MESSAGE_MARK.MARK : MESSAGE_MARK.NOT_MARK,
		msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
		is_read: !message?.is_read ? MESSAGE_READ.READ : MESSAGE_READ.NOT_READ
	})

	// 如果是当前会话，需要实时更新到页面
	if (message?.dialog_id === messageStore.dialogId) {
		await messageStore.createMessage(msg)

		// 更新标注消息
		if (isLableMessage(type)) {
			// 需要拿到最新的消息列表
			const messageStore = useMessageStore.getState()
			const messages = messageStore.allMessages.find((v) => v?.msg_id === msg?.reply_id)
			messages &&
				messageStore.updateMessage({
					...messages,
					is_label: type === msgType.LABEL ? MESSAGE_MARK.MARK : MESSAGE_MARK.NOT_MARK
				})
		}

		// 更新撤回消息
		if (isRecallMessage(type)) {
			// 需要拿到最新的消息列表
			const messageStore = useMessageStore.getState()
			const message = messageStore.allMessages.find((v) => v?.msg_id === msg?.reply_id)
			message && messageStore.deleteMessage(message)
		}
	}

	cacheStore.updateCacheMessage(msg)
	// 如果是标注消息，需要修改本地消息缓存
	isLableMessage(type) && updateLabelCacheMessage(msg)
	// 如果是撤回消息，需要修改本地消息缓存
	isRecallMessage(type) && updateRecallCacheMessage(msg)

	// 更新消息的总未读数
	if (msg.is_read === MESSAGE_READ.NOT_READ) {
		cacheStore.updateCacheUnreadCount(cacheStore.unreadCount + 1)
	}

	// 更新本地会话
	updateDialog(message, message.dialog_id)
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
	console.log('处理好友请求', data)
	const cacheStore = useCacheStore.getState()
	cacheStore.updateCacheApplyCount(cacheStore.applyCount + 1)
}

/**
 * 主入口
 */
function run() {
	const cacheStore = useCacheStore.getState()

	// 订阅 firstOpened 状态
	useCacheStore.subscribe(async ({ firstOpened }) => {
		if (firstOpened) {
			getBehindMessage()
			getRemoteSession()
			getApplyList()
			getFriendList()
			cacheStore.updateFirstOpened(false)
		}
	})
}

export default run
