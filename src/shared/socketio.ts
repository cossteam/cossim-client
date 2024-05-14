import { getCookie, setCookie } from '@/utils/cookie'
import { DEVICE_ID, SocketEvent, TOKEN } from '.'
import {
	handlerSocketEdit,
	handlerSocketMessage,
	handlerSocketOnline,
	handlerSocketRequest,
	handlerSocketResult,
	handlerSocketUpdateOnlineStatus
} from '@/run'
import { useLiveRoomStore } from '@/stores/liveRoom'
import { useLiveStore } from '@/stores/live'
import useRequestStore from '@/stores/request'

let socket: any = null

export function createSocket() {
	const token = getCookie(TOKEN)
	if (!token) throw new Error('User not logged in')
	const requestStore = useRequestStore.getState()
	const url = requestStore.config.wsUrl
	const urlObject = new URL(url)
	const path = urlObject.pathname
	let host = urlObject.origin
	const port = urlObject.port || (urlObject.protocol === 'wss:' ? 443 : 80)
	if (!urlObject.port) {
		// 如果端口号为空，则手动添加默认端口号到主机中
		host += ':' + port
	}
	// @ts-ignore
	socket = io(host, {
		query: {
			token
		},
		transports: ['websocket'],
		path: path
	})

	onReply(socket)
	return socket
}

export function closeSocket(Socket?: any) {
	if (Socket) Socket.close()
	else socket.close()
}

/**
 *
 * @param socket
 */
function onReply(socket: any) {
	const liveRoomStore = useLiveRoomStore.getState()
	const liveStore = useLiveStore.getState()

	socket.on('reply', function (msg: any) {
		const handlerInit = async (msg: any) => {
			const data = JSON.parse(msg ?? '{}')
			const event = data.event

			console.log('接收到所有 sokect 通知：', data)

			switch (event) {
				case SocketEvent.OnlineEvent: // 上线
					setCookie(DEVICE_ID, data.driverId)
					break
				case SocketEvent.PrivateChatsEvent: // 接收私聊消息
				case SocketEvent.GroupChatsEvent: // 接收群聊消息
				case SocketEvent.SelfChatsEvent: // 接收到自己发送的消息
					handlerSocketMessage(data)
					break
				case SocketEvent.ApplyListEvent: // 接收好友申请
				case SocketEvent.GroupApplyListEvent: // 接收群邀请
					handlerSocketRequest(data)
					break
				case SocketEvent.ApplyAcceptEvent: // 接收好友同意或拒绝
					handlerSocketResult(data)
					break
				// 通话事件
				case SocketEvent.UserCallReqEvent:
				case SocketEvent.GroupCallReqEvent:
				case SocketEvent.UserCallRejectEvent:
				case SocketEvent.GroupCallRejectEvent:
				case SocketEvent.UserCallHangupEvent:
				case SocketEvent.GroupCallHangupEvent:
				case SocketEvent.UserLeaveGroupCallEvent:
					// eslint-disable-next-line no-case-declarations
					const test = false
					if (test) {
						liveStore.handlerEvent(event, data) // 测试
					} else {
						liveRoomStore.handlerEvent(event, data)
					}
					break
				case SocketEvent.MessageEditEvent:
					handlerSocketEdit(data)
					break
				case SocketEvent.UserStatusEvent:
					// handlerSocketOnline(data)
					handlerSocketUpdateOnlineStatus(data)
					break
				case SocketEvent.UserOnlineEvent:
					handlerSocketOnline(data)
					break
			}
		}
		handlerInit(msg)
	})
}
