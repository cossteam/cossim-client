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
	CallStatus,
	handlerMessageSocket,
	SocketEvent,
	handlerLabelSocket,
	handlerRequestResultSocket,
	handlerEditSocket,
	DEVICE_ID,
	USER_ID
} from '@/shared'
import { getCookie, hasCookie, setCookie } from '@/utils/cookie'
import { useCallStore } from '@/stores/call'
import { useMessageStore, MessageStore } from './stores/message'
import { useStateStore } from '@/stores/state'
import { hasMike } from './utils/media'
import { App as CapApp } from '@capacitor/app'
import { Router } from 'framework7/types'
import localNotification, { LocalNotificationType } from '@/utils/notification'
import DOMPurify from 'dompurify'

let store: MessageStore | null = null

function App() {
	const msgStore = useMessageStore()
	const stateStore = useStateStore()
	const user_id = getCookie(USER_ID) || ''

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

	const { callInfo, updateCallInfo, updateStatus, reject } = useCallStore()

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
						console.log(msg.receiver_id, user_id, msg.receiver_id !== user_id && Number(store!.dialog_id))
						if (msg.receiver_id !== user_id && Number(store!.dialog_id)) {
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
				case SocketEvent.UserCallReqEvent:
				case SocketEvent.GroupCallReqEvent:
					// 来电
					try {
						// 更新通话信息
						const newCallInfo = { ...callInfo, evrntInfo: data }
						console.log('来电', data)
						if (event === SocketEvent.UserCallReqEvent) {
							newCallInfo['userInfo'] = {
								user_id: data?.data?.sender_id
							}
						} else {
							newCallInfo['groupInfo'] = {
								group_id: data?.data?.group_id
							}
						}
						updateCallInfo(newCallInfo)
						// 检查设备是否可用
						await hasMike()
						// 更新通话状态
						updateStatus(CallStatus.WAITING)
					} catch (error: any) {
						console.dir(error)
						if (error?.code === 8) {
							f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
							reject()
							return
						}
						f7.dialog.alert($t(error?.message || '接听失败...'))
					}
					break
				case SocketEvent.UserCallRejectEvent:
				case SocketEvent.GroupCallRejectEvent:
					// 拒绝
					{
						const newCallInfo = { ...callInfo, evrntInfo: data }
						if (event === SocketEvent.UserCallReqEvent) {
							newCallInfo['userInfo'] = {
								user_id: data?.data?.sender_id
							}
						} else {
							newCallInfo['groupInfo'] = {
								group_id: data?.data?.sender_id
							}
						}
						updateCallInfo(newCallInfo)
						updateStatus(CallStatus.REFUSE)
						setTimeout(() => {
							updateStatus(CallStatus.IDLE)
						}, 3000)
					}
					break
				case SocketEvent.UserCallHangupEvent:
				case SocketEvent.GroupCallHangupEvent:
					// 挂断
					{
						const newCallInfo = { ...callInfo, evrntInfo: data }
						if (event === SocketEvent.UserCallReqEvent) {
							newCallInfo['userInfo'] = {
								user_id: data?.data?.sender_id
							}
						} else {
							newCallInfo['groupInfo'] = {
								group_id: data?.data?.sender_id
							}
						}
						updateCallInfo(newCallInfo)
						updateStatus(CallStatus.HANGUP)
						setTimeout(() => {
							updateStatus(CallStatus.IDLE)
						}, 3000)
					}
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

	useEffect(() => {
		// @ts-ignore
		toastRef.current = f7.toast.create({
			text: $t('再按一次退出程序'),
			closeTimeout: 1000,
			position: 'center'
		})

		let backNumber = 0
		let timer: any = null
		const backButtonHandler = () => {
			backNumber++

			// @ts-ignore
			!router && toastRef.current?.open()

			timer && clearTimeout(timer)
			timer = setTimeout(() => {
				backNumber = 0
			}, 1000)

			if (backNumber > 1) CapApp.exitApp()

			if (router && router.history.length > 1) {
				router.back()
				router = null
			}
		}

		// 添加返回按钮事件监听器
		const backListener = CapApp.addListener('backButton', backButtonHandler)

		return () => {
			// 移除返回按钮事件监听器
			backListener.remove()
		}
	}, [])

	useEffect(() => {
		store = msgStore
	}, [msgStore])

	return (
		<AppComponent {...f7params}>
			{hasCookie(TOKEN) ? (
				<>
					{/* {callStatus !== CallStatus.IDLE && (
						<>
							<View
								url="/call/" 
								id="view-call"
								name="call"
								className={clsx(hideCall ? 'hide-call' : '')}
							/>
							{hideCall && (
								<div className=" fixed z-[9999] right-0 top-1/3 bg-slate-300 rounded-l-lg">
									<PhoneFill
										className="size-[40px] box-content p-2"
										onClick={() => updateHideCall(false)}
									/>
								</div>
							)}
						</>
					)} */}
					<Layout />
					<Popup id="call-popup" opened={false}>
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
