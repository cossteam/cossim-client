import { useState, useEffect, useRef } from 'react'
import { App as AppComponent, Popup, View, f7 } from 'framework7-react'
import { Framework7Parameters } from 'framework7/types'
import '@/utils/notification'
import routes from './router'
import Layout from './components/Layout'
import {
	$t,
	TOKEN,
	SocketClient,
	handlerRequestSocket,
	handlerMessageSocket,
	SocketEvent,
	handlerLabelSocket,
	handlerRequestResultSocket,
	handlerEditSocket,
	DEVICE_ID,
	burnAfterReading
} from '@/shared'
import { hasCookie, setCookie } from '@/utils/cookie'
import { useMessageStore, MessageStore } from './stores/message'
import { useStateStore } from '@/stores/state'
import { AppState, App as CapApp } from '@capacitor/app'
import { Router } from 'framework7/types'
import localNotification, { LocalNotificationType } from '@/utils/notification'
import DOMPurify from 'dompurify'
import { useNewCallStore } from './stores/new_call'
import { useAsyncEffect } from '@reactuses/core'
import { PluginListenerHandle } from '@capacitor/core'

let store: MessageStore | null = null

function App() {
	const msgStore = useMessageStore()
	const stateStore = useStateStore()
	// const user_id = getCookie(USER_ID) || ''

	const toastRef = useRef(null)

	let router: Router.Router | null = null

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
		},
		on: {
			routeChanged: (_newRoute: Router.Route, _previousRoute: Router.Route, _router: Router.Router) => {
				router = _router
			}
		}
	})

	const newCallStore = useNewCallStore()

	useEffect(() => {
		// 修复手机上的视口比例
		if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
			const viewEl = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
			viewEl.setAttribute('content', `${viewEl.getAttribute('content')}, maximum-scale=1, user-scalable=no`)
		}

		// 事件处理
		const handlerInit = async (e: any) => {
			const data = JSON.parse(e.data)
			const event = data.event
			console.log('接收到所有 sokect 通知：', data)
			switch (event) {
				case SocketEvent.OnlineEvent:
					setCookie(DEVICE_ID, data.driverId)
					break
				case SocketEvent.PrivateChatsEvent:
				case SocketEvent.GroupChatsEvent:
				case SocketEvent.SelfChatsEvent:
					try {
						const msg = data?.data || {}
						// msg 的发送者不是自己并且当前不在会话中
						// console.log(Number(msg.dialog_id), Number(store!.dialog_id))
						if (Number(msg.dialog_id) !== Number(store!.dialog_id)) {
							// 本地通知
							const dom = document.createElement('p')
							dom.innerHTML = DOMPurify.sanitize(msg.content || '')
							localNotification(LocalNotificationType.MESSAGE, msg.sender_info.name, dom.innerText)
							// 本地通知 END
						}
					} catch {
						console.log('发送本地通知失败')
					}
					handlerMessageSocket(data, store!, stateStore)
					break
				case SocketEvent.ApplyListEvent:
					handlerRequestSocket(data)
					break
				case SocketEvent.ApplyAcceptEvent:
					handlerRequestResultSocket(data)
					break
				case SocketEvent.UserCallReqEvent: // 用户来电
				case SocketEvent.GroupCallReqEvent: // 群聊来电
				case SocketEvent.UserCallRejectEvent: // 用户拒绝
				case SocketEvent.GroupCallRejectEvent: // 群聊拒绝
				case SocketEvent.UserCallHangupEvent: // 用户挂断
				case SocketEvent.GroupCallHangupEvent: // 群聊挂断
					newCallStore.handlerCallEvent(event, data)
					break
				case SocketEvent.MessageLabelEvent:
					handlerLabelSocket(data, store!)
					break
				case SocketEvent.MessageEditEvent:
					console.log('消息编辑', data)
					handlerEditSocket(data, store!)
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

	let backListener: PluginListenerHandle
	let appStateListener: PluginListenerHandle
	useAsyncEffect(
		async () => {
			// @ts-ignore
			toastRef.current = f7.toast.create({
				text: $t('再按一次退出程序'),
				closeTimeout: 1000,
				position: 'center'
			})

			let backNumber = 0
			let timer: NodeJS.Timeout | null = null
			const backButtonHandler = () => {
				timer && clearTimeout(timer)
				backNumber++
				// @ts-ignore
				!router && toastRef.current?.open()

				timer = setTimeout(() => {
					backNumber = 0
				}, 1000)

				if (backNumber > 1) CapApp.minimizeApp()

				if (router && router.history.length > 1) {
					router.back()
					router = null
				}
			}

			const appChange = async (state: AppState) => {
				if (state.isActive) {
					burnAfterReading()
					if (hasCookie(TOKEN) && SocketClient.isDisconnect()) {
						SocketClient.connect()
					}
				}
			}

			// 添加返回按钮事件监听器
			backListener = await CapApp.addListener('backButton', backButtonHandler)
			appStateListener = await CapApp.addListener('appStateChange', appChange)
		},
		() => {
			backListener && backListener.remove()
			appStateListener && appStateListener.remove()
		},
		[]
	)

	useEffect(() => {
		store = msgStore
	}, [msgStore])

	return (
		<AppComponent {...f7params}>
			{hasCookie(TOKEN) ? (
				<>
					<Layout />
					<Popup opened={newCallStore.visible}>
						<View url="/new_call/" />
					</Popup>
				</>
			) : (
				<View url="/auth/" id="view-auth" name="auth" />
			)}
		</AppComponent>
	)
}

export default App
