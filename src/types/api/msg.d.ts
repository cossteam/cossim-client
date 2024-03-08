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
}

export interface SendGroupMessage {
	at_all_user?: number
	at_users?: string
	content: string
	dialog_id: number
	is_burn_after_reading?: number
	replay_id?: number
	type: number
}

export interface EditMessage {
	msg_id: number
	content: string
	msg_type: number
}

export interface LabelMessage {
	msg_id: number
	is_label: number
}

export interface ReadMessage {
	msg_ids: number[]
	dialog_id: number
}

export type ReadGroupMessage = { group_id: number } & ReadMessage

export interface GetBehindMessage {
	dialog_id: number
	msg_id: number
}

export interface GetMessage {
	user_id?:string
	type?: string
	content?: string
	page_num: number
	page_size: number
}

export type GetGroupMessage = { group_id?: number } & GetMessage

export interface RevokeMessage {
	msg_id: number
}