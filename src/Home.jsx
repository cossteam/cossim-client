import React, { useEffect } from 'react'
import { getDevice } from 'framework7/lite-bundle'
// import './i18n'
// import '@/config'
// import f7params from '@/config'
import cordovaApp from '@/config/cordova-app'

import AppComponent from './pages/App'
import { f7, App, f7ready, Views, View } from 'framework7-react'

import routes from '@/config/routes'
import { useUserStore } from '@/stores/user'
// import { useChatsStore } from '@/stores/chats'
import WebSocketClient from '@/utils/WebSocketClient'
import WebDB from '@/db'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, user } = useUserStore()
	// const { chats, updateChats } = useChatsStore()
	const device = getDevice()

	// Framework7 Parameters
	const f7params = {
		name: '', // App name
		theme: 'auto', // Automatic theme detection

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
			iosOverlaysWebView: true,
			androidOverlaysWebView: false
		},

		colors: {
			primary: '#33a854'
		}
	}

	// TODO: 国际化
	// i18next.changeLanguage('zh-CN')

	f7ready(() => {
		// 注册 cordova API
		if (f7.device.cordova) {
			cordovaApp.init(f7)
		}
	})

	// 连接ws并监听消息推送
	useEffect(() => {
		if (!isLogin) return
		console.log(user.nick_name, user.user_id)
		WebSocketClient.closeConnection()
		WebSocketClient.connect()
		WebSocketClient.addListener('onWsMessage', (e) => {
			const data = JSON.parse(e.data)
			// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
			if (data.event === 3 || data.event === 4 || data.event === 5) {
				WebSocketClient.triggerEvent('onMessage', data)
			}
		})
		WebSocketClient.addListener('onMessage', (msg) => {
			if (msg.event === 3) {
				const message = {
					sender_id: msg.data.uid,
					receiver_id: msg.uid,
					type: 'received', // 接收方
					content: msg.data.content,
					content_type: msg.data.msgType, // 1: 文本消息
					date: new Date().getTime() - 2 * 60 * 60 * 1000,
					send_state: 'ok',
					is_read: true
				}
				// 消息持久化
				WebDB.messages.add(message)
				// await WebDB.messages.add(message)
				// TODO：更新会话列表数据
			}
		})
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
