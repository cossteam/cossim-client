/**
 * @description 一些防止页面被退出而终止的方法
 * @author  YuHong
 * @date  2024-03-7
 */
import UserStore from '@/db/user'

/**
 * 阅后即焚消息
 *
 * @returns
 */
export const burnAfterReading = async () => {
	// 查看需要焚毁的消息
	const readDestroy = await UserStore.findAll(UserStore.tables.read_destroy)
	if (readDestroy.length === 0) return

	// 创建销毁队列
	readDestroy.map((msg) => {
		const setTime = msg.self_destruct_time * 1000 * 1000
		const nowTime = Date.now()
		const readTime = msg.read_time

		// 用当前时间去减去创建时间，
		// 如果超过设置的自毁的设置时间，那么就删除该消息
		if (nowTime - readTime > setTime) {
			return UserStore.delete(UserStore.tables.read_destroy, 'uid', msg.uid)
		} else {
			const time = setTime - nowTime
			const timer = setTimeout(() => {
				UserStore.delete(UserStore.tables.read_destroy, 'uid', msg.uid)
				clearTimeout(timer)
			}, time)
		}
	})
}
