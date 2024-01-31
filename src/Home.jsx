import React, { useEffect, useState } from 'react'
import { getDevice } from 'framework7/lite-bundle'
import cordovaApp from '@/config/cordova-app'
import AppComponent from '@/pages/App'
import { f7, App, f7ready, Views, View } from 'framework7-react'
import routes from '@/config/routes'
import { useUserStore } from '@/stores/user'
import WebSocketClient from '@/utils/WebSocketClient'
import userService from '@/db'
import { useInitUser, useInitFriend } from '@/helpers/handler'
import { handlerMsgType } from '@/helpers/handlerType'

import { msgStatus, sendState } from '@/utils/constants'

/**
 * 异步处理消息。
 *
 * @param {Object} msg -要处理的消息。
 */
const handlerMessage = async (msg) => {
	try {
		const message = {
			msg_read_status: msgStatus.NOT_READ,
			msg_type: handlerMsgType(msg.msgType),
			msg_content: msg.content,
			msg_id: msg.msg_id,
			msg_send_time: msg.send_at,
			msg_is_self: false,
			meg_sender_id: msg.uid,
			dialog_id: msg.dialog_id,
			msg_send_state: sendState.OK
		}

		// 加入消息列表
		await userService.add(userService.TABLES.USER_MSGS, message)

		const result = await userService.findOne(userService.TABLES.CHATS_LIST, 'dialog_id' + message.dialog_id)
		if (!result) {
			// 会话列表
			await userService.add(userService.TABLES.CHATS_LIST, message)
			return
		}

		// 更新会话列表
		await userService.update(userService.TABLES.CHATS_LIST, result.id, {
			...result,
			last_message: message.msg_content
		})
	} catch (error) {
		console.log('更新会话列表失败！', error)
		// TODO: 做一些额外操作
	}
}

/**
 * 好友管理
 * @param {*} msg
 * @returns
 */
const handlerManger = async (msg) => {
	try {
		if (msg.data?.status === 0) {
			console.log('收到对方拒绝')
			// 提醒用户
			return
		}

		await useInitFriend({
			user_id: msg?.uid,
			friend_id: msg?.data?.user_id,
			data: JSON.parse(msg?.data?.e2e_public_key || '{}') || {}
		})
	} catch (error) {
		// TODO: 这里可以统一上报
		console.log('error', error)
	}
}

const handlerGroupMessage = async (msg) => {
	console.log('msg', msg)
	console.log('msg.data.content', JSON.parse(msg?.data?.content))

	// 查找本地消息记录
	const sender = `${msg.data?.group_id}`
	const messages = await userService.findOneById(userService.TABLES.MSGS, sender)

	// 收到的消息
	const message = JSON.parse(msg?.data?.content)
	// const message = {
	// 	unique_id,
	// 	content: msg.data.content, // 内容
	// 	sender: msg.data.user_id, // 发送人
	// 	dialog_id: msg.data.dialog_id, // 会话
	// 	group_id: msg.data.group_id, // 群组(私聊时为receiver_id)
	// 	// receiver_id: parseInt(ReceiverId), // 接收人(群聊时为group_id)
	// 	time, // 时间
	// 	type: '' // 1:文本 2:语音 3:图片
	// 	// send_status: 0 // 0:未发送 1:发送中 2:发送成功 3:发送失败
	// }

	// 存入本地数据库
	const newAllMsg = {
		user_id: sender,
		data: messages?.data || []
	}
	if (!messages) {
		newAllMsg.data.push(message)
		await userService.add(userService.TABLES.MSGS, newAllMsg)
	} else if (!newAllMsg.data.find((obj) => obj.unique_id === message.unique_id)) {
		newAllMsg.data.push(message)
		await userService.update(userService.TABLES.MSGS, sender, newAllMsg)
	}
}

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, user } = useUserStore()
	const device = getDevice()

	// const visibility = useDocumentVisibility('visible')

	// Framework7 Parameters
	const [f7params] = useState({
		name: '', // App name
		theme: 'ios', // Automatic theme detection
		// App store
		store: [],
		// App routes
		routes: routes,
		// Input settings
		input: {
			scrollIntoViewOnFocus: device.cordova,
			scrollIntoViewCentered: device.cordova
		},
		// Cordova Statusbar settings
		statusbar: {
			iosOverlaysWebView: true, // 在iOS上叠加在WebView上,
			androidOverlaysWebView: false,
			androidBackgroundColor: '#ffffff', // 设置Android状态栏的背景色
			iosBackgroundColor: '#ffffff' // 设置iOS状态栏的背景色
		},
		colors: {
			primary: '#33a854'
		}
	})

	// TODO: 国际化
	// i18next.changeLanguage('zh-CN')

	// 注册 cordova API
	f7ready(() => f7.device.cordova && cordovaApp.init(f7))

	// 连接ws并监听消息推送
	useEffect(() => {
		if (!isLogin) return

		// 初始化 users 表
		useInitUser(user)

		// 初始化 websocket
		WebSocketClient.connect()

		/**
		 * 初始化
		 *
		 * @param {*} e
		 */
		const handlerInit = (e) => {
			const data = JSON.parse(e.data)
			// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
			// event: 6 => 收到好友请求 event: 7 => 收到好友确认 event: 8 => 公钥交换
			switch (data.event) {
				case 3:
					console.info('接收到消息：', data)
					handlerMessage(data.data)
					break
				case 4:
					handlerGroupMessage(data)
					break
				case 6:
				case 7:
					console.info('收到好友请求或确认：', data)
					handlerManger(data)
					break
			}
		}

		WebSocketClient.addListener('onWsMessage', handlerInit)

		return () => {
			WebSocketClient.removeListener('onWsMessage', handlerInit)
		}
	}, [isLogin])

	return (
		<App {...f7params}>
			<Views tabs className="safe-area">
				{isLogin ? <AppComponent isLogin={isLogin} /> : <View id="view-auth" name="auth" url="/auth/" />}
			</Views>
		</App>
	)
}

export default Home
