export interface MessageUserInfo {
    /** 发送者ID */
    user_id: string
    /** 发送者名称 */
    name: string
    /** 发送者头像 */
    avatar: string
}

export interface Message {
    /** 消息内容 */
    content: string
    /** 是否阅后即焚 */
    is_burn_after_reading: boolean
    /** 是否标记消息 */
    is_label: boolean
    /** 消息ID */
    msg_id: number
    /** 消息类型 */
    msg_type: number
    /** 消息发送时间 */
    send_at: number
    /** 消息发送者ID */
    sender_id: string
    /** 消息发送者信息 */
    sender_info: MessageUserInfo
    /** 是否回复消息 */
    reply: number
    /** 接收者信息 */
    receiver_info: MessageUserInfo
}

export interface DialogListItem {
    /** 会话头像 */
    dialog_avatar: string
    /** 会话名称 */
    dialog_name: string
    /** 会话创建时间 */
    dialog_create_at: number
    /** 会话ID */
    dialog_id: number
    /** 会话类型 */
    dialog_type: number
    /** 会话未读消息数 */
    dialog_unread_count: number
    /** 置顶层级 */
    top_at: number
    /** 群组ID */
    group_id?: number
    /** 用户 ID */
    user_id?: number
    /** 上一次消息 */
    last_message: Message
    /** 草稿 */
    draft?: string
}
