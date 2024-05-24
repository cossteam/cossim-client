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
}
