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
	dialog_id: number
	is_burn_after_reading?: boolean
}

export interface SendGroupMessage {
	at_all_user?: number
	at_users?: string
	content: string
	dialog_id: number
	replay_id?: number
	type: number
}

export interface EditMessage {
	content: string
	msg_type: number
}

export interface LabelMessage {
	is_label: boolean
}

export interface ReadMessage {
	msg_ids: number[]
	dialog_id: number
	read_all: true
}


export interface GetBehindMessage {
	dialog_id: number
	msg_id: number
}

export interface GetMessage {
	dialog_id: number
	user_id?: string
	type?: string
	content?: string
	page_num: number
	page_size: number
	start_at?: number
	end_at: number
}

export type GetGroupMessage = { group_id?: number } & GetMessage

export interface RevokeMessage {
	msg_id: number
}

export interface GetDialog {
	page_num: number
	page_size: number
}
