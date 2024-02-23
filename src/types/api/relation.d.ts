
export interface FriendListParams {
    user_id?: string
}

export interface AddFriendData {
    user_id: string
    remark?: string
    e2e_public_key: string
}

export interface ManageFriendData {
    action?: number
    e2e_public_key?: string
    request_id: number
}

export interface BlackListData {
    user_id: string
    friend_id: string
}

export interface SilenceData {
    user_id: string
    is_silent?: number
}

export interface BurnData {
    action?: number
    user_id: string
}