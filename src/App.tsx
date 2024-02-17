import { useState, useEffect } from 'react'
import { App as AppComponent, View, f7 } from 'framework7-react'
import { Framework7Parameters } from 'framework7/types'

import routes from './router'
import Layout from './components/Layout'
import { $t, TOKEN, SocketClient } from '@/shared'
import { hasCookie } from '@/utils/cookie'

function App() {
	const [f7params] = useState<Framework7Parameters>({
		name: '',
		theme: 'ios',
		routes,
		colors: {
			primary: '#33a854'
		},
		dialog: {
			buttonOk: $t('确定'),
			buttonCancel: $t('取消'),
			preloaderTitle: $t('加载中...')
		},
		touch: {
			tapHold: true
		}
	})
	// const [socket, setSocket] = useState<Socket>()

	// 修复手机上的视口比例
	useEffect(() => {
		if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
			const viewEl = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
			viewEl.setAttribute('content', `${viewEl.getAttribute('content')}, maximum-scale=1, user-scalable=no`)
		}

		// const socketUrl = import.meta.env.VITE_WS_URL + `?token=${getCookie(TOKEN)}`
		// const socket = io(socketUrl, {
		// 	path: import.meta.env.VITE_BASE_WS_URL,
		// 	transports: ['websocket']
		// })
		// console.log('socket', socket.io)
		// 连接成功
		// socket.on('open', () => {
		// 	console.log('Socket connected')
		// })
		// socket.on('message', (data) => {
		// 	console.log('接收到消息', data)
		// })
		// setSocket(socket)

		const handlerInit = (e: any) => {
			const data = JSON.parse(e.data)
			switch (data.event) {
				case 3:
					console.info('接收或发送消息：', data)
					// handlerMessage(data.data, user?.user_id, chatType.PRIVATE)
					break
				case 4:
					// handlerGroupMessage(data)
					// handlerMessage(data.data, user?.user_id, chatType.GROUP)
					break
				case 6:
				case 7:
					// console.info('收到好友请求或确认：', data)
					// handlerManger(data)
					break
				case 12:
					console.log('接收或发送的消息：', data)
					break
				case 14: // 用户来电
				case 15: // 群聊来电
					// liveStore.updateLiveInfo({
					// 	event: data.event,
					// 	...data.data
					// })
					// liveStore.updateLiveStatus(liveStatus.WAITING)
					break
				case 16: // 用户通话拒绝
				case 17: // 群聊通话拒绝
					// liveStore.updateLiveInfo({
					// 	event: data.event,
					// 	...data.data
					// })
					// liveStore.updateLiveStatus(liveStatus.REJECTED)
					break
				case 18: // 用户通话挂断
				case 19: // 群聊通话挂断
					// liveStore.updateLiveInfo({
					// 	event: data.event,
					// 	...data.data
					// })
					// liveStore.updateLiveStatus(liveStatus.END)
					break
			}
		}

		// 连接 socket
		if (hasCookie(TOKEN)) {
			SocketClient.connect()
			SocketClient.addListener('onWsMessage', handlerInit)
		}

		return () => {
			SocketClient.removeListener('onWsMessage', handlerInit)
		}
	}, [])

	return (
		<AppComponent {...f7params}>
			{hasCookie(TOKEN) ? <Layout /> : <View url="/auth/" id="view-auth" name="auth" />}
		</AppComponent>
	)
}

export default App
