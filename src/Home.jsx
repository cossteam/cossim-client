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

// import { switchE2EKeyApi } from '@/api/relation'
// import { toBase64 } from '@/utils/signal/signal-protocol'
import { toArrayBuffer, cretaeSession, toBase64, decrypt } from '@/utils/signal/signal-protocol'
import { SignalProtocolAddress, SessionCipher } from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from '@/utils/signal/storage-type'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, signal } = useUserStore()
	// const { chats, updateChats } = useChatsStore()
	const device = getDevice()

	// 会话
	// const [sessionCipher, setSessionCipher] = useState()

	async function init(user_id) {
		try {
			// 获取对方信息
			const data = await WebDB.session.where('user_id').equals(user_id).first()

			console.log('查找到用户信息', data, user_id)

			// 对方的仓库
			const store = new SignalProtocolStore(toArrayBuffer(data.store))
			// 初始化对方地址
			const addr = new SignalProtocolAddress(data.directory.deviceName, data.directory.deviceId)
			// 初始化会话
			const cipher = new SessionCipher(store, addr)

			// setSessionCipher(cipher)

			return cipher
		} catch (error) {
			console.log('消息初始化失败', error)
			return null
		}
	}

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

	// const { directory } = useUserStore()

	const updateKey = async (msg) => {
		try {
			console.log('msg.data.status', msg.data.status, msg)
			// debugger
			if (msg.data?.status === 0) {
				// todo: 添加被拒绝处理
				console.log('添加被拒绝处理')
				return
			} else {
				console.log('出来')
				// 对方的公钥
				const directory = JSON.parse(msg.data?.e2e_public_key || '{}')

				// 先查找数据库中有无这个用户，如果有就修改，如果无就添加
				const directoryId = await WebDB.keypairs
					.where('user_id')
					.equals(msg.data?.user_id || '')
					.first()

				const newObj = { ...directory, user_id: msg.data?.user_id }

				if (directoryId) {
					await WebDB.keypairs.update(directoryId.id, newObj)
				} else {
					await WebDB.keypairs.add(newObj)
				}

				// 查找是否已经有会话了
				const session = await WebDB.session
					.where('user_id')
					.equals(msg.data?.user_id || '')
					.first()

				console.log('是否已经有session', session)

				if (session) return

				// 对方的地址
				const address = new SignalProtocolAddress(directory.deviceName, directory.deviceId)
				// 自己的仓库
				const store = new SignalProtocolStore(toArrayBuffer(signal.store))
				// 创建会话
				// const cipher = new SessionCipher(store, address)
				// 初始化会话
				const sess = await cretaeSession(store, address, toArrayBuffer(directory))
				console.log('sess', sess)
				console.log('toBase64(store)', toBase64(store))
				await WebDB.session.add({
					store: toBase64(store),
					user_id: msg.data?.user_id,
					directory
				})
			}
		} catch (error) {
			console.log('error', error)
		}
	}

	// 连接ws并监听消息推送
	useEffect(() => {
		if (!isLogin) return

		WebSocketClient.closeConnection()
		WebSocketClient.connect()

		WebSocketClient.addListener('onWsMessage', (e) => {
			const data = JSON.parse(e.data)
			// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
			if (data.event === 3 || data.event === 4 || data.event === 5) {
				WebSocketClient.triggerEvent('onMessage', data)
			}

			// event: 6 => 收到好友请求 event: 7 => 收到好友确认 event: 8 => 公钥交换
			if (data.event === 6 || data.event === 7) {
				console.log('好友管理', data.data)
				// WebSocketClient.triggerEvent('onManager', data)
				updateKey(data, data.event)
			}
		})

		WebSocketClient.addListener('onMessage', async (msg) => {
			if (msg.event === 3) {
				// console.log("msg",msg);
				// 重连会话
				const cipher = await init(msg.data.sender_id)
				console.log('解密后消息', msg.data.content)
				const message = {
					// id: '', // msg_id: '', // 消息id
					sender_id: '', // 发送者id
					receiver_id: msg.uid, // 接收者id
					content: await decrypt(JSON.parse(msg.data.content), cipher),
					content_type: msg.data.msgType, // 消息类型 => 1: 文本消息
					type: 'received', // 接收方
					reply_id: msg.data.reply_id, // 所回复消息的id
					read_at: null, // 接收时间/读取时间
					created_at: msg.data.send_at, // 发送时间
					dialog_id: msg.data.dialog_id, // 会话id
					send_state: 'ok' // 发送成功/接收成功
				}
				console.log('解密后消息', message.content)
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
