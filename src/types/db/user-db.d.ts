/**
 * 会话表
 */
export interface DialogsList {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 群 id
	 */
	group_id: string | number
	/**
	 * 用户 id
	 */
	user_id: string
	/**
	 * 头像
	 */
	avatar: string
	/**
	 * 群名 / 用户名
	 */
	nick_name: string
	/**
	 * 在线状态
	 */
	status: number
	/**
	 * 会话 id
	 */
	dialog_id: number
	/**
	 * 消息
	 */
	msg_content: string
	/**
	 * 消息 id
	 */
	msg_id: number
	/**
	 * 其他扩展信息
	 */
	other_info: any
}

/**
 * 好友表
 */
export interface Friends {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 用户 id
	 */
	user_id: string
	/**
	 * 头像
	 */
	avatar: string
	/**
	 * 用户名
	 */
	nick_name: string
	/**
	 * 邮箱
	 */
	email: string
	/**
	 * 签名
	 */
	signature: string
	/**
	 * 状态
	 */
	status: number
	/**
	 * 电话
	 */
	tel: string
	/**
	 * 会话 id
	 */
	dialog_id: number
	/**
	 * 分组名 # A B C D ...
	 */
	group: string
	/**
	 * 其他扩展信息, 如：黑名单、消息免打扰
	 */
	other_info: any
}

/**
 * 群表
 */
export interface Groups {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 群 id
	 */
	group_id: string
	/**
	 * 头像
	 */
	group_avatar: string
	/**
	 * 群名称
	 */
	group_name: string
	/**
	 * 会话 id
	 */
	dialog_id: number
	/**
	 * 分组名 # A B C D ...
	 */
	group: string
	/**
	 * 其他扩展信息, 如：黑名单、消息免打扰
	 */
	other_info: any
}

/**
 * 单聊消息表
 */
export interface PrivateChats {
	/** id */
	id?: number
	/** 消息内容 */
	content: string
	/** 创建时间 */
	created_at: number
	/** 会话 id */
	dialog_id: number
	/** 阅后即焚 */
	is_burn_after_reading: number
	/** 是否被标记 */
	is_label: number
	/** 是否已读 */
	is_read: number
	/** 已读时间 */
	read_at: number
	/** 对方 id */
	receiver_id: string
	/** 回复者 id  */
	replay_id: number
	/** 发送者 id */
	sender_id: string
	/** 消息类型 */
	type: number
	/** 消息 id */
	msg_id: number
	/** 消息发送状态*/
	msg_send_state?: number
	/** 其他扩展信息 */
	[key: string]: any
}

/**
 * 群聊消息
 */
export interface GroupChats {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 群 id
	 */
	group_id: string
	/**
	 * 消息 id
	 */
	msg_id: number
	/**
	 * 消息阅读状态
	 */
	msg_read_status: number
	/**
	 * 消息类型
	 */
	msg_type: number
	/**
	 * 消息内容
	 */
	msg_content: string
	/**
	 * 消息发送者 id
	 */
	msg_sender_id: string
	/**
	 * 会话 id
	 */
	dialog_id: number
	/**
	 *
	 * 消息发送状态
	 */
	msg_send_state: number
	/**
	 * 其他扩展信息, 如：黑名单、消息免打扰
	 */
	other_info: any
}

/**
 * 申请列表
 */
export interface ApplyList {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 用户 id
	 */
	user_id: string
	/**
	 * 头像
	 */
	avatar: string
	/**
	 * 用户名
	 */
	nick_name: string
	/**
	 * 邮箱
	 */
	email: string
	/**
	 * 留言
	 */
	message: string
}

/**
 * 客户端通讯密钥
 */
export interface ClientPGPKeys {
	/**
	 * 自增 id
	 */
    id?: number,
    /**
     * 服务端公钥
     */
    server_public_Key: string,
    /**
     * 客户端密钥
     */
    private_key: string,
    /**
     * 客户端公钥
     */
    public_key: string,
    /**
     * 撤销凭证
     */
    revocation_certificate: string
}
