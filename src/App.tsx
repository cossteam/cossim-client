import { useState, useEffect } from 'react'
import { App as AppComponent, View, f7 } from 'framework7-react'
import { Framework7Parameters } from 'framework7/types'

import '@/utils/notification'
import routes from './router'
import Layout from './components/Layout'
import {
	$t,
	TOKEN,
	SocketClient,
	handlerRequestSocket,
	RID,
	CallEvent,
	CallStatus,
	handlerMessageSocket
} from '@/shared'
import { hasCookie, setCookie } from '@/utils/cookie'
import { useCallStore } from '@/stores/call'
import { useMessageStore } from './stores/message'

function App() {
	const { updateMessage } = useMessageStore()

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

	const { updateStatus } = useCallStore()

	useEffect(() => {
		// 修复手机上的视口比例
		if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
			const viewEl = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
			viewEl.setAttribute('content', `${viewEl.getAttribute('content')}, maximum-scale=1, user-scalable=no`)
		}

		// 事件处理
		const handlerInit = (e: any) => {
			const data = JSON.parse(e.data)
			const event = data.event
			console.log('接收到所有 sokect 通知：', data)
			switch (event) {
				case 1:
					console.log('链接成功', data)

					setCookie(RID, data.rid)
					break
				case 3:
				case 4:
				case 12:
					handlerMessageSocket(data, updateMessage)
					break
				case 6:
				case 7:
					handlerRequestSocket(data)
					break
				// case 12:
				// 	console.log('接收或发送的消息：', data)
				// 	break
				case CallEvent.UserCallReqEvent:
				case CallEvent.GroupCallReqEvent:
					updateStatus(CallStatus.CALLING)
					break
				case CallEvent.UserCallRejectEvent:
				case CallEvent.GroupCallRejectEvent:
					updateStatus(CallStatus.REJECTED)
					setTimeout(() => {
						updateStatus(CallStatus.IDLE)
					}, 3000)
					break
				case CallEvent.UserCallHangupEvent:
				case CallEvent.GroupCallHangupEvent:
					updateStatus(CallStatus.DISCONNECTED)
					setTimeout(() => {
						updateStatus(CallStatus.IDLE)
					}, 3000)
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
