export interface MessageListParams {
	user_id: string
	type?: string
	content?: string
	page_num: number
	page_size: number
}

export interface SendMessage {
	content: string
	receiver_id: string
	replay_id?: number
	type: number
}
