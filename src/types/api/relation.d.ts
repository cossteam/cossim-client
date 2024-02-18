
export interface FriendListParams {
    user_id?: string
}

export interface AddFriendData {
    user_id: string
    remark?: string
    e2e_public_key: string
}