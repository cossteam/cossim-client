
import { getCookie, setCookie } from '@/utils/cookie'
import { DEVICE_ID, SocketEvent, TOKEN } from '.'
import { handlerSocketEdit, handlerSocketMessage, handlerSocketOnline, handlerSocketRequest, handlerSocketResult } from '@/run'

export function createSocket() {
    const token = getCookie(TOKEN)
    if (!token) throw new Error('User not logged in')
    const url = import.meta.env.VITE_WS_URL
    const urlObject = new URL(url)
    const path = urlObject.pathname
    const host = urlObject.host
    const socket = io(host, {
        query: {
            token
        },
        transports: ['websocket'],
        path: path,
    })
    
    onReply(socket)
    return socket
}

export function closeSocket(socket: any) {
    socket.close()
}

function onReply(socket:any){
    socket.on('reply', function(msg: any){
        const handlerInit = async (msg: any) => {
        const data = JSON.parse(msg ?? '{}')
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
                // liveRoomStore.handlerEvent(event, data)
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