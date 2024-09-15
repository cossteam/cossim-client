/*** 主题*/
export enum THEME {
    LIGHT = 'light',
    DARK = 'dark'
}

/** 错误状态码 */
export enum RESPONSE_CODE {
    /** 未认证 */
    Unauthorized = 401
}

/** 消息类型 */
export enum MESSAGE_TYPE {
    /** 错误消息 */
    ERROR = -1,
    /** 无内容 */
    NONE = 0,
    /** 文本 */
    TEXT = 1,
    /** 音频 */
    AUDIO = 2,
    /** 图片 */
    IMAGE = 3,
    /** 标注 */
    LABEL = 4,
    /** 通知 */
    NOTICE = 5,
    /** 文件 */
    FILE = 6,
    /** 视频文件 */
    VIDEO = 7,
    /** 表情回复 */
    EMOJI = 8,
    /** 语音通话消息 */
    VOICE = 9,
    /** 视频通话消息  */
    CALL = 10,
    /** 撤回消息 */
    RECALL = 11,
    /** 取消标注 */
    CANCEL_LABEL = 12
}

/** 消息发送状态 */
export enum MESSAGE_SEND_STATE {
    /** 发送中 */
    SENDING = 0,
    /** 发送成功 */
    SUCCESS = 1,
    /** 发送失败 */
    FAILED = 2
}

/** 语言类型 */
export enum LANGUAGE_TYPE {
    /** 英文 */
    EN = 'en',
    /** 简体中文 */
    ZH = 'zh',
    /** 繁体中文 */
    TC = 'tc'
}

/** 组件切换状态 */
export enum COMPONENT_SWITCH_STATE {
    /** 聊天 */
    CHAT = 0,
    /** 联系人 */
    CONTACT = 1
}

/** 路由 */
export enum ROUTE {
    /** 消息 */
    MESSAGE = 'message',
    /** 联系人 */
    CONTACT = 'contact',
    /** 设置 **/
    PROFILE = 'profile',
}

/** 申请列表状态管理 */
export enum ApplyStatus {
	/** 申请中 */
	PENDING = 0,
	/** 已同意 */
	ACCEPT = 1,
	/** 已拒绝 */
	REFUSE = 2,
	/** 邀请发送者 */
	INVITE_SENDER = 3,
	/** 被邀请者 */
	INVITE_RECEIVER = 4
}