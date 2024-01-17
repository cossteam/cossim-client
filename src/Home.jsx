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
// import { useLiveQuery } from 'dexie-react-hooks'

import { switchE2EKeyApi } from '@/api/relation'
// import { toBase64 } from '@/utils/signal/signal-protocol'

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

	const { directory } = useUserStore()

	const updateKey = async (msg) => {
		try {
			const directory = JSON.parse(msg.data?.e2e_public_key || '')
			// 先查找数据库中有无这个用户，如果有就修改，如果无就添加
			const directoryId = await WebDB.keypairs
				.where('user_id')
				.equals(msg.data?.user_id || '')
				.first()
			const newObj = {
				...directory,
				user_id: msg.data?.user_id
			}
			console.log('directoryId', directoryId)
			if (directoryId) {
				WebDB.keypairs.update(directoryId.id, newObj)
				return
			}
			WebDB.keypairs.add(newObj)
		} catch (error) {
			console.log('error', error)
		}
	}

	const switchE2EKey = async (msg) => {
		// const res = await switchE2EKeyApi({ public_key: JSON.stringify(directory), user_id: msg.data.user_id })
		// console.log('交换公钥', res)
	}

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

			// event: 6 => 收到好友请求 event: 7 => 收到好友确认 event: 8 => 公钥交换
			if (data.event === 6 || data.event === 7 || data.event === 8) {
				console.log('好友管理', data.data)
				// WebSocketClient.triggerEvent('onManager', data)

				// 同意添加好友
				if (data.status && data.status === 1) {
					updateKey(data)
				}
				

				// if (data.event === 8) {
				// 	switchE2EKey(data)
				// }
			}
		})

		WebSocketClient.addListener('onMessage', async (msg) => {
			if (msg.event === 3) {
				// console.log(msg)
				const message = {
					// id: '', // msg_id: '', // 消息id
					sender_id: '', // 发送者id
					receiver_id: msg.uid, // 接收者id
					content: msg.data.content,
					content_type: msg.data.msgType, // 消息类型 => 1: 文本消息
					type: 'received', // 接收方
					reply_id: msg.data.reply_id, // 所回复消息的id
					read_at: null, // 接收时间/读取时间
					created_at: msg.data.send_at, // 发送时间
					dialog_id: msg.data.dialog_id, // 会话id
					send_state: 'ok' // 发送成功/接收成功
				}
				// console.log(message)
				// 消息持久化
				const msgId = await WebDB.messages.add(message)
				console.log(msgId)
				// TODO：检查当前会话是否存在 => 新建会话数据 or 更新会话列表数据
				// const chats = useLiveQuery(() => WebDB.chats.toArray()) || []
				// 检查当前会话是否存在 ? WebDB.chats.add({}) : WebDB.chats.update(msg.data.msg_id, {})
				const chat = await WebDB.chats.where('dialog_id').equals(msg?.data?.dialog_id).first()
				// 更新会话列表数据
				chat && WebDB.chats.update(chat.id, { last_message: message.content, msg_id: msgId })
			}
		})

		// WebSocketClient.addListener('onManager', async (msg) => {
		// 	// 发自己的公钥给对面
		// 	// const res = await switchE2EKeyApi({ public_key: JSON.stringify(directory), user_id: msg.data.user_id })/
		// 	// console.log('交换公钥', res)
		// })

		// try {
		// 	// console.log("signal",signal.directory._data[signal.deviceName])
		// 	const directory = signal.directory._data[signal.deviceName]
		// 	const obj = {
		// 		...directory,
		// 		deviceName: signal.deviceName,
		// 		deviceId: signal.deviceId
		// 	}
		// 	const data = JSON.stringify(toBase64(obj))
		// 	console.log("userStore",JSON.stringify(toBase64(obj)))
		// 	// 交换信令
		// 	switchE2EKeyApi({public_key:data, user_id:"787bb5d3-7e63-43d0-ad4f-4c3e5f31a71c"})
		// } catch (error) {
		// 	console.log("交换密钥失败",error)
		// }
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
