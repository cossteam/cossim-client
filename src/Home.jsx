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
import { useChatsStore } from '@/stores/chats'
import { initConnect } from '@/utils/ws'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, user } = useUserStore()
	const { chats, updateChats } = useChatsStore()
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

	useEffect(() => {
		// 连接ws并监听消息
		if (isLogin) {
			const ws = initConnect()
			console.log(user.nick_name, user.user_id)
			ws?.removeEventListener('message', () => {})
			ws.addEventListener('message', (e) => {
				const data = JSON.parse(e.data)
				console.log(data)
				// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
				if (data.event === 3) {
					// 接收者
					const userId = data.data.uid
					const messagesData = chats.filter((chat) => chat.userId === userId)[0] || {
						messages: []
					}
					console.log(messagesData.messages)
					messagesData.messages.push({
						text: data.data.content,
						type: 'received',
						date: new Date().getTime() - 2 * 60 * 60 * 1000
					})
					console.log(chats)
					updateChats(chats)
				}
			})
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
