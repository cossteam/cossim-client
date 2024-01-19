import React, { useEffect, useState } from 'react'
import { getDevice } from 'framework7/lite-bundle'
import cordovaApp from '@/config/cordova-app'
import AppComponent from '@/pages/App'
import { f7, App, f7ready, Views, View } from 'framework7-react'
import routes from '@/config/routes'
import { useUserStore } from '@/stores/user'
import WebSocketClient from '@/utils/WebSocketClient'
import { dbService } from '@/db'

import { toArrayBuffer, cretaeSession, toBase64 } from '@/utils/signal/signal-protocol'
import { SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
import { SignalProtocolStore } from '@/utils/signal/storage-type'
// import { reconnectSession } from '@/utils/utils'

/**
 * 异步处理消息。
 *
 * @param {Object} msg -要处理的消息。
 */
const handlerMessage = async (msg) => {
	// 重连会话
	// const cipher = await reconnectSession(msg.data.sender_id)

	// console.log('接收回来的东西', msg.data.content)
	// let content = ''
	// try {
	// 	content = await decrypt(JSON.parse(msg.data.content), cipher)
	// 	console.log('解密后消息', content)
	// } catch (error) {
	// 	console.log('解密失败', error)
	// 	// 解密失败就返回原消息
	// 	content = msg.data.content
	// }

	// content = await pgpEncrypt(content)

	// console.log('pgpEncrypt后的消息', content)

	const message = {
		// 发送者id
		sender_id: '',
		// 接收者id
		receiver_id: msg.uid,
		// 消息内容
		content: msg.data.content,
		// 消息类型 => 1: 文本消息
		content_type: msg.data.msgType,
		// 接收方
		type: 'received',
		// 所回复消息的id
		reply_id: msg.data.reply_id,
		// 接收时间/读取时间
		read_at: null,
		// 发送时间
		created_at: msg.data.send_at,
		// 会话id
		dialog_id: msg.data.dialog_id,
		// 发送成功/接收成功
		send_state: 'ok'
	}

	console.log("接收到消息",message);

	// 查找本地消息记录
	const result = await dbService.findOneById(dbService.TABLES.MSGS, msg.data?.sender_id)

	// 如果有记录就更新，没有就添加到表中
	result
		? dbService.update(dbService.TABLES.MSGS, msg.data?.sender_id, {
				user_id: msg.data?.sender_id,
				data: [...result.data, message]
			})
		: dbService.add(dbService.TABLES.MSGS, { user_id: msg.data?.sender_id, data: [message] })
}

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, user, signal, identity, directory } = useUserStore()
	const device = getDevice()

	// Framework7 Parameters
	const [f7params] = useState({
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
	})

	// TODO: 国际化
	// i18next.changeLanguage('zh-CN')

	// 注册 cordova API
	f7ready(() => f7.device.cordova && cordovaApp.init(f7))

	/**
	 * 好友管理
	 * @param {*} msg
	 * @returns
	 */
	const handlerManger = async (msg) => {
		try {
			if (msg.data?.status === 0) {
				// TODO: 添加被拒绝处理
				console.log('添加被拒绝处理')
				return
			} else {
				// 对方的公钥
				const directory = JSON.parse(msg.data?.e2e_public_key || '{}')

				// 查找自己的信息
				const reslut = await dbService.findOneById(dbService.TABLES.USERS, user?.user_id)

				if (!reslut) return

				console.log('收到添加或同意信息', directory)

				// 查找是否和好友已经有会话了, 如果有了就不需要再创建了
				const session = await dbService.findOneById(dbService.TABLES.SESSION, msg.data?.user_id)
				if (session) return

				// 自己的仓库
				const store = new SignalProtocolStore(toArrayBuffer(reslut.data.signal.store))
				// 对方的地址
				const address = new SignalProtocolAddress(directory.deviceName, directory.deviceId)
				// 初始化会话
				await cretaeSession(store, address, toArrayBuffer(directory))

				// 对方的仓库
				// const store2 = new SignalProtocolStore(toArrayBuffer(directory?.store))
				// 自己的地址
				// const address2 = new SignalProtocolAddress(reslut?.data?.signal?.address?._name, reslut?.data?.signal?.address?._deviceId)
				// 初始化会话
				// await cretaeSession(store2, address2,toArrayBuffer(reslut.data?.directory))

				// 对方的仓库
				// const selfStore = new SignalProtocolStore(toArrayBuffer(reslut.data.signal.store))

				// 持久化会话到数据库
				await dbService.add(dbService.TABLES.SESSION, {
					user_id: msg.data?.user_id,
					data: {
						store: toBase64(store),
						directory,
					}
				})
			}
		} catch (error) {
			// TODO: 这里可以统一上报
			console.log('error', error)
		}
	}

	// 初始化用户
	const initUsers = async () => {
		// 如果已经有了用户信息，就不需要添加
		const result = await dbService.findOneById(dbService.TABLES.USERS, user?.user_id)

		if (result) return

		// 添加用户
		const success = await dbService.add(dbService.TABLES.USERS, {
			user_id: user?.user_id,
			data: {
				signal,
				info: user,
				identity,
				directory
			}
		})

		// TODO: 这里可以统一上报
		if (!success) console.log('添加用户失败')

		console.log('indexDB 添加用户成功', success)
	}

	// 连接ws并监听消息推送
	useEffect(() => {
		if (!isLogin) return

		// 初始化 users 表
		initUsers()

		// 初始化 websocket
		WebSocketClient.connect()

		/**
		 * 初始化
		 *
		 * @param {*} e
		 */
		const handlerInit = (e) => {
			const data = JSON.parse(e.data)

			switch (data.event) {
				// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
				case 3:
					handlerMessage(data)
					break
				// event: 6 => 收到好友请求 event: 7 => 收到好友确认 event: 8 => 公钥交换
				case 6:
				case 7:
					handlerManger(data)
					break
			}
		}

		WebSocketClient.addListener('onWsMessage', handlerInit)
		// WebSocketClient.addListener('onMessage', handlerMessage)

		return () => {
			WebSocketClient.removeListener('onWsMessage', handlerInit)
			// WebSocketClient.removeListener('onMessage', handlerMessage)
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
