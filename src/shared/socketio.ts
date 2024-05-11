import { getCookie, setCookie } from '@/utils/cookie'
import { DEVICE_ID, SocketEvent, TOKEN } from '.'
import {
	handlerSocketEdit,
	handlerSocketMessage,
	handlerSocketOnline,
	handlerSocketRequest,
	handlerSocketResult
} from '@/run'
import { useLiveRoomStore } from '@/stores/liveRoom'
import useRequestStore from '@/stores/request'

export function createSocket() {
	const token = getCookie(TOKEN)
	if (!token) throw new Error('User not logged in')
	const requestStore = useRequestStore.getState()
	const url = requestStore.currentWsUrl
	const urlObject = new URL(url)
	const path = urlObject.pathname
	let host = urlObject.origin
	const port = urlObject.port || (urlObject.protocol === 'wss:' ? 443 : 80)
	if (!urlObject.port) {
		// 如果端口号为空，则手动添加默认端口号到主机中
		host += ':' + port
	}
	// @ts-ignore
	const socket = io(host, {
		query: {
			token
		},
		transports: ['websocket'],
		path: path
	})

	onReply(socket)
	return socket
}

export function closeSocket(socket: any) {
	socket.close()
}

/**
 *
 * @param socket
 */
function onReply(socket: any) {
	const liveRoomStore = useLiveRoomStore.getState()

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
					liveRoomStore.handlerEvent(event, data)
					break
				case SocketEvent.MessageEditEvent:
					handlerSocketEdit(data)
					break
				case SocketEvent.UserOnlineEvent:
					handlerSocketOnline(data)
					break
			}
		}
		handlerInit(msg)
	})
}
