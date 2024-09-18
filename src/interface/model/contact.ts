export interface ContactPreferences {
    open_burn_after_reading: boolean
    open_burn_after_reading_time_out: number
    remark: string
    silent_notification: boolean
}

export interface Contact {
    avatar: string
    coss_id: string
    dialog_id: number
    email: string
    nickname: string
    preferences: ContactPreferences
    relation_status: number
    signature: string
    status: number
    tel: string
    user_id: string
    group?: string
}
