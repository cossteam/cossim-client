export declare global {
	interface ResponseData<T = any> {
		code: number
		data: T
		msg: string
	}

	interface ChatData {
		dialog_avatar: string
		dialog_name: string
		dialog_create_at: number
		dialog_id: number
		dialog_type: number
		dialog_unread_count: number
		top_at: number
		group_id?: number
		user_id?: number
		last_message: {
			content: string
			is_burn_after_reading: boolean
			is_label: boolean
			msg_id: number
			msg_type: number
			send_time: number
			sender_id: string
			sender_info: {
				user_id: string
				name: string
				avatar: string
			}
			reply: number
			// TODO: 添加接收者信息
			// receiver_info: {}
		}
	}

	/** Electron 环境 */
	declare const __IS_ELECTRON__: boolean
	/** Web 环境 */
	declare const __IS_WEB__: boolean
	/** Android 环境 */
	declare const __IS_ANDROID__: boolean
	/** IOS 环境 */
	declare const __IS_IOS__: boolean
	/** 原生平台环境 */
	declare const __IS_NATIVE__: boolean

	/** sokcet.io-client */
	interface SocketOptions {
		query?: string | { [key: string]: string }
		transports?: string[]
		path?: string
		hostname?: string
		secure?: boolean
		reconnection?: boolean
		reconnectionAttempts?: number
	}

	interface Socket {
		on(event: string, callback: (...args: any[]) => void): Socket
		once(event: string, callback: (...args: any[]) => void): Socket
		off(event: string, callback?: (...args: any[]) => void): Socket
		emit(event: string, ...args: any[]): Socket
		disconnect(): void
		close(): void
		id: string
		connected: boolean
	}

	declare function io(url?: string, SocketOptions?: SocketOptions): Socket
}
