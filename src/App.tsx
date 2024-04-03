import { useState, useEffect, useRef } from 'react'
import { App as AppComponent, View, f7 } from 'framework7-react'
import { Framework7Parameters } from 'framework7/types'
import '@/utils/notification'
import routes from './router'
import Layout from './components/Layout'
import { $t, TOKEN, SocketClient, SocketEvent, DEVICE_ID, burnAfterReading, toastMessage } from '@/shared'
import { hasCookie, setCookie } from '@/utils/cookie'
import { AppState, App as CapApp } from '@capacitor/app'
import { Router } from 'framework7/types'
import { useAsyncEffect } from '@reactuses/core'
import { PluginListenerHandle } from '@capacitor/core'
import Preview from './components/Preview/Preview'
import LiveRoomNew from '@/components/LiveRoom'
import { useLiveRoomStore } from './stores/liveRoom'
import { StatusBar, Style } from '@capacitor/status-bar'
import useCacheStore from '@/stores/cache'
import run, { handlerSocketEdit, handlerSocketMessage, handlerSocketRequest } from './run'
import { isWeb } from './utils'

function App() {
	const router = useRef<Router.Router | null>(null)

	const liveRoomStore = useLiveRoomStore()
	const cacheStore = useCacheStore()

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
					handlerSocketMessage(data)
					break
				case SocketEvent.ApplyListEvent:
				case SocketEvent.GroupApplyListEvent:
					handlerSocketRequest(data)
					break
				case SocketEvent.ApplyAcceptEvent:
					// handlerRequestResultSocket(data)
					break
				// 通话事件
				case SocketEvent.UserCallReqEvent:
				case SocketEvent.GroupCallReqEvent:
				case SocketEvent.UserCallRejectEvent:
				case SocketEvent.GroupCallRejectEvent:
				case SocketEvent.UserCallHangupEvent:
				case SocketEvent.GroupCallHangupEvent:
					liveRoomStore.handlerEvent(event, data)
					break
				case SocketEvent.MessageEditEvent:
					handlerSocketEdit(data)
					break
			}
		}

		// 连接 socket
		if (hasCookie(TOKEN)) {
			cacheStore.init()
			run()
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
			let backNumber = 0
			let timer: NodeJS.Timeout | null = null

			const historyRoutes = ['/dialog/', '/contact/', '/my/']

			const backButtonHandler = () => {
				timer && clearTimeout(timer)
				backNumber++

				timer = setTimeout(() => {
					backNumber = 0
				}, 1000)

				const flag = historyRoutes.includes(router.current?.currentRoute.url ?? '')
				if (flag) toastMessage('再按一次退出程序')
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

	useAsyncEffect(
		async () => {
			try {
				if (await isWeb()) return
				// if (liveRoomStore.opened) {
				// 	await StatusBar.hide()
				// 	return
				// }
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
		[liveRoomStore.opened]
	)

	return (
		<AppComponent {...f7params}>
			{hasCookie(TOKEN) ? (
				<>
					<Layout />
					<Preview />
					<LiveRoomNew />
				</>
			) : (
				<View url="/auth/" id="view-auth" name="auth" />
			)}
		</AppComponent>
	)
}

export default App
