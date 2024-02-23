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
	CallStatus,
	handlerMessageSocket,
	SocketEvent,
	handlerLabelSocket,
	handlerRequestResultSocket
} from '@/shared'
import { hasCookie, setCookie } from '@/utils/cookie'
import { useCallStore } from '@/stores/call'
import { useMessageStore } from './stores/message'
import { useStateStore } from '@/stores/state'

function App() {
	const msgStore = useMessageStore()
	const stateStore = useStateStore()

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

	const { status: callStatus, callInfo, updateCallInfo, updateStatus } = useCallStore()

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
				case SocketEvent.OnlineEvent:
					setCookie(RID, data.rid)
					break
				case SocketEvent.PrivateChatsEvent:
				case SocketEvent.GroupChatsEvent:
				case SocketEvent.SelfChatsEvent:
					handlerMessageSocket(data, msgStore.updateMessage, stateStore)
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
					{
						const newCallInfo = { ...callInfo, evrntInfo: data }
						console.log('来电', data)

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
						updateStatus(CallStatus.WAITING)
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
					console.log('消息标注信息', data)
					handlerLabelSocket(data, msgStore)
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
			{hasCookie(TOKEN) ? (
				<>
					{callStatus !== CallStatus.IDLE && <View url="/call/" id="view-call" name="call" />}
					<Layout />
				</>
			) : (
				<View url="/auth/" id="view-auth" name="auth" />
			)}
		</AppComponent>
	)
}

export default App
