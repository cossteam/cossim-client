/**
 * 消息是否超过撤回时间
 *
 * @param {number}  time   消息时间
 * @param {number}  recall 撤回时间	单位：分钟，默认2分钟
 * @returns {boolean}
 */
export function isOverRecallTime(time: number, recall: number = 2) {
	const now = Date.now()
	const diff = now - time
	const diffMinute = diff / 1000 / 60
	return diffMinute > recall
}
