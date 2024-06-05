export interface groupListParams {
    user_id: string
}

export interface CreateGroupData {
    avatar?: string
    name: string
    type?: number
    member?: string[]
    encrypt?: boolean
    join_approve: boolean
}
