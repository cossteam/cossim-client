export interface groupListParams {
	user_id: string
}

export interface CreateGroupData {
	avatar?: string
	name: string
	type?: number
	max_members_limit?: number
	member?: string[]
}
