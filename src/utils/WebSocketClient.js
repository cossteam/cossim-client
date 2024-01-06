import { getStorage } from '@/utils/stroage'

class WebSocketClient {
	constructor(serverAddress) {
		this.serverAddress = serverAddress
		this.socket = null
		this.listeners = {}

		if (!WebSocketClient.instance) {
			WebSocketClient.instance = this
		}

		return WebSocketClient.instance
	}

	// 连接服务器
	connect() {
		if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
			this.socket = new WebSocket(this.serverAddress)

			this.socket.addEventListener('open', (event) => {
				this.triggerEvent('onWsOpen', event)
				console.log('WebSocket连接已建立')
			})

			this.socket.addEventListener('message', (event) => {
				this.triggerEvent('onWsMessage', event)
				console.log('收到消息:', event.data)
				// 在这里处理收到的消息，更新UI或执行其他操作
			})

			this.socket.addEventListener('close', (event) => {
				this.triggerEvent('onWsClose', event)
				console.log('WebSocket连接已关闭')
			})

			this.socket.addEventListener('error', (event) => {
				this.triggerEvent('onWsError', event)
				console.error('WebSocket错误:', event)
			})
		}
	}

	// 发送消息
	sendMessage(message) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(message)
		} else {
			console.error('WebSocket连接尚未建立')
		}
	}

	// 关闭连接
	closeConnection() {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close()
		}
	}

	// 添加监听器
	addListener(eventType, callback) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = []
		}
		this.listeners[eventType].push(callback)
	}

	// 移除监听器
	removeListener(eventType, callback) {
		if (this.listeners[eventType]) {
			this.listeners[eventType] = this.listeners[eventType].filter((cb) => cb !== callback)
		}
	}

	// 触发监听器
	triggerEvent(eventType, event) {
		if (this.listeners[eventType]) {
			this.listeners[eventType].forEach((callback) => callback(event))
		}
	}
}

// 创建全局唯一的WebSocketClient实例
const token = getStorage()?.state?.token
const wsClient = new WebSocketClient(`ws://localhost:8080/api/v1/msg/ws?token=${token}`)

// 导出模块
export default wsClient
