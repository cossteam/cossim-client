// import { getStorage } from '@/utils/stroage'
// import { HOST } from '@/utils/request'

import { getCookie } from '@/utils/cookie'
import { TOKEN } from '.'

class Socket {
	private serverAddress: string
	private socket: WebSocket | null
	private listeners: any
	// 重连次数
	private reconnectTimes = 0
	// 最大重连次数
	private maxReconnectTimes = 999999999999
	private static instance: Socket | null

	constructor(url: string) {
		this.serverAddress = url
		this.socket = null
		this.listeners = {}

		if (!Socket.instance) {
			Socket.instance = this
		}

		return Socket.instance
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
			})

			this.socket.addEventListener('close', (event) => {
				this.triggerEvent('onWsClose', event)
				console.log('WebSocket连接已关闭')
				this.reconnect()
			})

			this.socket.addEventListener('error', (event) => {
				this.triggerEvent('onWsError', event)
				console.error('WebSocket错误:', event)
				this.reconnect()
			})
		}
	}

	// 发送消息
	sendMessage(message: any) {
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
	addListener(eventType: string, callback: (e:any) => void) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = []
		}
		this.listeners[eventType].push(callback)
	}

	// 移除监听器
	removeListener(eventType: string, callback: (e:any) => void) {
		if (this.listeners[eventType]) {
			this.listeners[eventType] = this.listeners[eventType].filter((cb: any) => cb !== callback)
		}
	}

	// 触发监听器
	triggerEvent(eventType: string, event: any) {
		if (this.listeners[eventType]) {
			this.listeners[eventType].forEach((callback: any) => callback(event))
		}
	}

	/**
	 * 重连
	 */
	reconnect(time = 5000) {
		if (this.reconnectTimes < this.maxReconnectTimes) {
			setTimeout(() => {
				this.reconnectTimes++
				this.connect()
			}, time)
		}
	}
}

const socketUrl = import.meta.env.VITE_WS_URL + `?token=${getCookie(TOKEN)}`
const SocketClient = new Socket(socketUrl)

export { SocketClient }
