import { useState, useEffect, useRef } from 'react'
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
	handlerMessageSocket,
	SocketEvent,
	handlerLabelSocket,
	handlerRequestResultSocket,
	handlerEditSocket,
	DEVICE_ID,
	burnAfterReading,
	handlerRecallSocket
} from '@/shared'
import { hasCookie, setCookie } from '@/utils/cookie'
import { useMessageStore, MessageStore } from './stores/message'
import { useStateStore } from '@/stores/state'
import { AppState, App as CapApp } from '@capacitor/app'
import { Router } from 'framework7/types'
import localNotification, { LocalNotificationType } from '@/utils/notification'
import DOMPurify from 'dompurify'
import { useAsyncEffect } from '@reactuses/core'
import { PluginListenerHandle } from '@capacitor/core'
import Preview from './components/Preview/Preview'
import LiveRoomNew from '@/components/LiveRoom'
import { LiveRoomStates, useLiveRoomStore } from './stores/liveRoom'
import { StatusBar, Style } from '@capacitor/status-bar'
import useCacheStore from '@/stores/cache'
import run from './run'
import { isWebDevice } from './utils'

let store: MessageStore | null = null

function App() {
	const msgStore = useMessageStore()
	const stateStore = useStateStore()

	const toastRef = useRef(null)

	const router = useRef<Router.Router | null>(null)

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
				router.current = _router
			}
		}
	})

	const liveRoomStore = useLiveRoomStore()
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
			// console.log('接收到所有 sokect 通知：', data)
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
				// 通话事件
				case SocketEvent.UserCallReqEvent:
				case SocketEvent.GroupCallReqEvent:
				case SocketEvent.UserCallRejectEvent:
				case SocketEvent.GroupCallRejectEvent:
				case SocketEvent.UserCallHangupEvent:
				case SocketEvent.GroupCallHangupEvent:
					if (liveRoomStore.state !== LiveRoomStates.IDLE) {
						f7.dialog.confirm('你有新的通话请求是否结束当前通话并接听？', () => {
							liveRoomStore.updateEvent(event, data)
						})
						break
					}
					liveRoomStore.updateEvent(event, data)
					break
				case SocketEvent.MessageLabelEvent:
					handlerLabelSocket(data, store!)
					break
				case SocketEvent.MessageEditEvent:
					console.log('消息编辑', data)
					handlerEditSocket(data, store!)
					break
				case SocketEvent.MessageRecallEvent:
					handlerRecallSocket(data, store!)
					break
			}
		}

		// 连接 socket
		if (hasCookie(TOKEN)) {
			run()
			SocketClient.connect()
			SocketClient.addListener('onWsMessage', handlerInit)
		}

		// 计算页面高度
		msgStore.updateHeight(document.documentElement.clientHeight)

		return () => {
			SocketClient.removeListener('onWsMessage', handlerInit)
		}
	}, [])

	let backListener: PluginListenerHandle
	let appStateListener: PluginListenerHandle

	// const [isActive, setIsActive] = useState(true)

	useAsyncEffect(
		async () => {
			let backNumber = 0
			let timer: NodeJS.Timeout | null = null

			// @ts-ignore
			toastRef.current = f7.toast.create({
				text: $t('再按一次退出程序'),
				closeTimeout: 1000,
				position: 'center'
			})

			const historyRoutes = ['/dialog/', '/contact/', '/my/']

			const backButtonHandler = () => {
				timer && clearTimeout(timer)
				backNumber++
				// @ts-ignore
				// !router.current &&

				timer = setTimeout(() => {
					backNumber = 0
				}, 1000)

				const flag = historyRoutes.includes(router.current?.currentRoute.url ?? '')
				// @ts-ignore
				if (flag) toastRef.current?.open()
				if (backNumber > 1) {
					if (flag) {
						CapApp.minimizeApp()
					}
				}

				if (router.current && router.current.history.length > 1) {
					router.current.back()
					router.current = null
				}
			}

			const appChange = async (state: AppState) => {
				if (state.isActive) {
					burnAfterReading()
					if (hasCookie(TOKEN) && SocketClient.isDisconnect()) {
						SocketClient.connect()
					}
					cacheStore.updateFirstOpened(true)
				} else {
					cacheStore.updateFirstOpened(false)
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

	useAsyncEffect(
		async () => {
			try {
				if(await isWebDevice()) return
				// 设置状态栏样式
				StatusBar.setBackgroundColor({ color: '#ffffff' }) // 设置状态栏背景颜色为白色
				StatusBar.setOverlaysWebView({ overlay: false }) // 如果您使用的是原生状态栏，则需设置为 false
				// 设置状态栏文字颜色
				StatusBar.setStyle({ style: Style.Light }) // 设置状态栏文字为黑色
			} catch (error) {
				console.log(error)
			}
		},
		() => {},
		[]
	)

	// 获取缓存
	const cacheStore = useCacheStore()

	useEffect(() => {
		cacheStore.init()
	}, [])


	return (
		<AppComponent {...f7params}>
			{hasCookie(TOKEN) ? (
				<>
					<Layout />
					{/* <Message /> */}
					<Preview />
					{/* <LiveRoom /> */}
					<LiveRoomNew />
				</>
			) : (
				<View url="/auth/" id="view-auth" name="auth" />
			)}
		</AppComponent>
	)
}

export default App
