export type User = {
    email: string
    nickname: string
    avatar: string | null
    token?: string | null
} | null

interface DialogInterface {
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
        send_at: number
        sender_id: string
        sender_info: {
            user_id: string
            name: string
            avatar: string
        }
        reply: number
        receiver_info: {
            avatar: string
            name: string
            user_id: string
        }
    }
    draft?: string
}
