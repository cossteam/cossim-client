import React, { useEffect, useState } from 'react'
import { getDevice } from 'framework7/lite-bundle'
import cordovaApp from '@/config/cordova-app'
import AppComponent from '@/pages/App'
import { f7, App, f7ready, Views, View } from 'framework7-react'
import routes from '@/config/routes'
import { useUserStore } from '@/stores/user'
import WebSocketClient from '@/utils/WebSocketClient'
import userService from '@/db'
// import { updatePublicKeyApi } from '@/api/user'
// import { toArrayBuffer, cretaeSession, toBase64 } from '@/utils/signal/signal-protocol'
// import { SignalProtocolAddress } from '@privacyresearch/libsignal-protocol-typescript'
// import { SignalProtocolStore } from '@/utils/signal/storage-type'
// import {
// 	generateKeyPair,
// 	performKeyExchange,
// 	importPublicKey,
// 	exportKey,
// 	exportPublicKey
// } from '@/utils/signal/signal-crypto'
import { useInitUser, useInitFriend } from '@/helpers/handler'

/**
 * 异步处理消息。
 *
 * @param {Object} msg -要处理的消息。
 */
const handlerMessage = async (msg) => {
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

	console.log('收到消息！！！', msg)

	// 查找本地消息记录
	const result = await userService.findOneById(userService.TABLES.USERS, msg.data?.sender_id)
	// 如果有记录就更新，没有就添加到表中
	console.log('result', result)
	// result
	await userService.update(userService.TABLES.USERS, msg.data?.sender_id, {
		user_id: msg.data?.sender_id,
		// data: [...result.data, message]
		data: {
			...result.data,
			data: [...result.data.msgs, message]
		}
	})
	// : userService.add(userService.TABLES.USERS, { user_id: msg.data?.sender_id, data: [message] })

	// 会话列表
	const chats = await userService.findOneById(userService.TABLES.CHATS, msg.data?.dialog_id, 'dialog_id')
	chats
		? userService.update(userService.TABLES.CHATS, chats.id, { ...message, last_message: msg.data.content })
		: userService.add(userService.TABLES.CHATS, msg.data)

	// WebSocketClient.triggerEvent('onChats', { ...message, last_message: msg.data.content })
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

// /**
//  * 处理会话
//  * @param {Object} directory	目录
//  * @param {String} user_id		好友 id
//  * @returns
//  */
// const handlerSession = async (directory, user_id, friend_id) => {
// 	try {
// 		console.log('处理会话', directory, user_id)
// 		// 查找自己的信息
// 		const reslut = await userService.findOneById(userService.TABLES.USERS, user_id)
// 		if (!reslut) return

// 		// 查找是否和好友已经有会话了, 如果有了就不需要再创建了
// 		const session = await userService.findOneById(userService.TABLES.SESSION, friend_id)
// 		if (session) return

// 		// 得到对方公钥
// 		const publicKey = await importPublicKey(directory?.publicKey)
// 		// 生成预共享密钥
// 		const preKey = await performKeyExchange(reslut?.data?.keyPair, publicKey)
// 		// base64
// 		const preKeyBase64 = await exportKey(preKey)

// 		// 自己的仓库
// 		const store = new SignalProtocolStore(toArrayBuffer(reslut.data.signal.store))
// 		// 对方的地址
// 		const address = new SignalProtocolAddress(directory.deviceName, directory.deviceId)

// 		delete directory.publicKey

// 		// 初始化会话
// 		await cretaeSession(store, address, toArrayBuffer({ ...directory }))

// 		// 持久化会话到数据库
// 		await userService.add(userService.TABLES.SESSION, {
// 			user_id: friend_id,
// 			data: {
// 				store: toBase64(store),
// 				directory,
// 				preKey: preKeyBase64
// 			}
// 		})
// 	} catch (error) {
// 		console.log('处理会话失败', error)
// 	}
// }

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	const { isLogin, user } = useUserStore()
	const device = getDevice()

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
				console.log('收到添加或同意信息', msg)
				// await handlerSession(JSON.parse(msg.data?.e2e_public_key || '{}'), user?.user_id, msg.data?.user_id)
				await useInitFriend({
					user_id: user?.user_id,
					friend_id: msg.data?.user_id,
					data: JSON.parse(msg.data?.e2e_public_key || '{}')
				})
			}
		} catch (error) {
			// TODO: 这里可以统一上报
			console.log('error', error)
		}
	}

	// 连接ws并监听消息推送
	useEffect(() => {
		if (!isLogin) return

		// 初始化 users 表
		// initUsers()
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

			switch (data.event) {
				// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息
				case 3:
					console.log('接收消息', e.data)
					handlerMessage(data)
					break
				case 4:
					handlerGroupMessage(data)
					break
				// event: 6 => 收到好友请求 event: 7 => 收到好友确认 event: 8 => 公钥交换
				case 6:
				case 7:
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
