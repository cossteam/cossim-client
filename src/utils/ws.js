const baseURL = 'ws://192.168.1.12:8080/api/v1/msg/ws'
let ws = null
// const listener = new Map()

function onOpen(e) {
	console.log('WebSocket连接成功', e)
	// TODO: 发送登录消息
}
function onMessage(e) {
	const data = JSON.parse(e.data)
	// event: 1 => 用户上线，2 => 用户下线，3 => 用户发送消息，4 => 群聊发送消息，5 => 系统推送消息

	switch (data.event) {
		case 1:
			console.log('用户上线', data.data)
			break
		case 2:
			console.log('用户下线', data.data)
			break
		case 3:
			console.log('用户发送消息', data.data)
			break
		case 4:
			console.log('群聊发送消息', data.data)
			break
		case 5:
			console.log('系统推送消息', data.data)
			break
		default:
			console.log('未知消息', data.data)
	}
}
function onClose(e) {
	console.log('WebSocket连接关闭', e)
	// TODO: 重连
}
function onError(e) {
	console.log('WebSocket连接发生错误', e)
	// TODO: 重连
}

export function initConnect() {
	ws?.removeEventListener('open', onOpen)
	ws?.removeEventListener('message', onMessage)
	ws?.removeEventListener('close', onClose)
	ws?.removeEventListener('error', onError)
	const token = JSON.parse(localStorage.getItem('COSS_DEV_STRORAGE'))?.state?.token
	ws = new WebSocket(`${baseURL}?token=${token}`)
	ws.addEventListener('open', onOpen)
	ws.addEventListener('message', onMessage)
	ws.addEventListener('close', onClose)
	ws.addEventListener('error', onError)
	return ws
}

export function sendMsg(data) {
	if (!ws) {
		console.log('ws未连接')
		return
	}
	ws.send(JSON.stringify(data))
}
