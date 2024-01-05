const baseURL = 'ws://192.168.1.8:8081/api/v1/msg/ws'
let ws = null
function onOpen(e) {
	console.log('WebSocket连接成功', e)
	// TODO: 发送登录消息
}
function onMessage(e) {
	const { data, event } = JSON.parse(e.data)
	console.log('服务器返回消息：', data, event)
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
