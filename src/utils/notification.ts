import { ListChannelsResult, LocalNotifications, ScheduleOptions, ScheduleResult } from '@capacitor/local-notifications'

export enum LocalNotificationType {
	/** 系统消息通知 */
	MESSAGE_SYSTEN = 0,
	/** 消息通知 */
	MESSAGE = 1,
	/** 来电通知 */
	CALL = 2
}

export default async function localNotification(title: string, body: string, type: LocalNotificationType) {
	try {
		// 获取通知通道（类别）
		const listChannels: ListChannelsResult = await LocalNotifications.listChannels()
		console.log(listChannels)
		let permissionStatus = await LocalNotifications.checkPermissions()
		window.localStorage.setItem('permissionStatus', JSON.stringify(permissionStatus))
		if (permissionStatus.display !== 'granted') {
			console.error('本地通知权限未开启，请求权限')
			permissionStatus = await LocalNotifications.requestPermissions()
			if (permissionStatus.display !== 'granted') {
				console.error('本地通知权限未开启，请求权限失败')
				return
			}
		}
		const notification: ScheduleOptions = {
			notifications: [
				{
					title,
					body,
					id: type
					// schedule: { at: new Date(Date.now() + 1000 * 5) } // 5 秒后触发
				}
			]
		}
		const scheduleResult: ScheduleResult = await LocalNotifications.schedule(notification)
		console.log('本地通知已发送', scheduleResult)
	} catch (error) {
		console.error('本地通知创建失败', error)
	}
}

localNotification('这是一个本地通知!', '这是一个示例通知。', LocalNotificationType.MESSAGE)
