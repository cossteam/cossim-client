const baseURL = 'ws://192.168.1.8:8083/api/v1/msg/ws'
let ws = null

export function getInstance() {
	if (ws !== null) return ws
	ws = new WebSocket(`${baseURL}?token=123456`)
	ws.addEventListener('beforeopen', function (event) {})
	ws.addEventListener('open', function (event) {
		console.log('WebSocket连接成功')
	})
	ws.addEventListener('message', function (event) {
		console.log('服务器返回消息：', event.data)
	})
	ws.addEventListener('close', function (event) {
		console.log('WebSocket连接关闭')
	})
	ws.addEventListener('error', function (event) {
		console.log('WebSocket连接发生错误')
	})
	return ws
}

export default ws
