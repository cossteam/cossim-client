// import useCacheStore from '@/stores/cache'
// import cacheStore from '@/utils/cache'

/**
 * 将字符串消息 HTML 内容提取文本内容
 * @param content HTML 消息内容
 */
export function extractTextFromHTML(content: string) {
	const doc = new DOMParser().parseFromString(content, 'text/html')
	return doc.body.textContent || ''
}

// /**
//  * 更新会话窗内容
//  * @param {any} message
//  */
// export const updateDialog = async (message: any) => {
// 	const cacheStore = useCacheStore.getState()
// 	const cacheDialogs = cacheStore.cacheDialogs.map((dialog) => {
// 		if (dialog.dialog_id === message.dialog_id) {
// 			return { ...dialog, last_message: { ...dialog.last_message, ...message } }
// 		}
// 		return dialog
// 	})
// 	cacheStore.updateCacheDialogs(cacheDialogs)
// }

// /**
//  * 更新缓存消息和会话
//  * @param {string} tableName	表名
//  * @param {any[]} messages		消息列表
//  */
// export const updateCacheMessage = async (tableName: string, messages: any[]) => {
// 	await cacheStore.set(tableName, messages)
// 	await updateDialog(messages.at(-1))
// }
