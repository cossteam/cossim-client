import useCacheStore from '@/stores/cache'
import MsgService from '@/api/msg'

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
		cacheStore.updateUnreadCount(unreadCount)
	} catch (error) {
		console.error('获取远程会话失败：', error)
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
	} catch (error) {
		console.error('获取落后消息失败：', error)
	}
}


/**
 * 主入口
 */
function run() {
	const cacheStore = useCacheStore.getState()

	// 订阅 firstOpened 状态
	useCacheStore.subscribe(async ({ firstOpened }) => {
		if (firstOpened) {
			await getBehindMessage()
			await getRemoteSession()
			cacheStore.updateFirstOpened(false)
		}
	})

}

export default run
