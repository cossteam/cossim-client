/** 错误状态码 */
export enum RESPONSE_CODE {
	/** 未认证 */
	Unauthorized = 401
}

/** 消息类型 */
export enum MESSAGE_TYPE {
	/** 文本 */
	TEXT = 1,
	/** 音频 */
	AUDIO = 2,
	/** 图片 */
	IMAGE = 3,
	/** 标注消息 */
	LABEL = 4,
	/** 置顶消息 */
	STICKER = 5,
	/** 文件 */
	FILE = 6,
	/** 待办 */
	TODO = 7
}

/** 消息阅读状态 */
export enum MESSAGE_READ {
	/** 未读 */
	NOT_READ = 0,
	/** 已读 */
	READ = 1,
	/** 已删除 */
	DELETED = 2
}

/** 消息发送状态 */
export enum MESSAGE_SEND {
	/** 发送中 */
	SENDING = 0,
	/** 发送成功 */
	SEND_SUCCESS = 1,
	/** 发送失败 */
	SEND_FAILED = 2
}

/** 消息标记状态 */
export enum MESSAGE_MARK {
	/** 未标记 */
	NOT_MARK = 0,
	/** 已标记 */
	MARK = 1
}

/** 提示类型 */
export enum TOOLTIP_TYPE {
	/** 复制 */
	COPY = 'copy',
	/** 转发 */
	FORWARD = 'forward',
	/** 编辑 */
	EDIT = 'edit',
	/** 删除 */
	DELETE = 'delete',
	/** 多选 */
	SELECT = 'select',
	/** 回复 */
	REPLY = 'reply',
	/** 标记 */
	MARK = 'mark',
	/** 无操作 */
	NONE = 'none'
}

/** 平台 */
export enum PLATFORM {
	/** web */
	WEB = 'web',
	/** ios */
	IOS = 'ios',
	/** android */
	ANDROID = 'android'
}

/** 申请列表类型 */
export enum ApplyType {
	/** 好友 */
	FRIEND = 0,
	/** 群聊 */
	GROUP = 1
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

/** 群聊管理列表状态管理 */
// export enum ApplyGroupStatus {
// 	/** 申请中 */
// 	PENDING = 0,
// 	/** 已同意 */
// 	ACCEPT = 1,
// 	/** 已拒绝 */
// 	REFUSE = 2,
// 	/** 邀请发送者 */
// 	INVITE_SENDER = 3,
// 	/** 被邀请者 */
// 	INVITE_RECEIVER = 4
// }

/** 群聊成员列表类型 */
export enum MemberListType {
	/** 非本群成员 */
	NOTMEMBER = 'not_member',
	/** 本群成员 */
	MEMBER = 'member',
	/** 本群成员（仅展示） */
	MEMBERSHOW = 'member_show'
}

/** 通话状态 WebSocket 推送事件 */
export enum CallEvent {
	/** 用户通话呼叫请求事件 */
	UserCallReqEvent = 14,
	/** 群聊通话呼叫请求事件 */
	GroupCallReqEvent = 15,
	/** 用户通话呼叫拒绝事件 */
	UserCallRejectEvent = 16,
	/** 群聊通话呼叫拒绝事件 */
	GroupCallRejectEvent = 17,
	/** 用户通话挂断事件 */
	UserCallHangupEvent = 18,
	/** 群聊通话挂断事件 */
	GroupCallHangupEvent = 19
}

export enum CallStatus {
	/** 空闲 */
	IDLE = 0,
	/** 占线 */
	BUSY = 1,
	/** 等待 */
	WAITING = 2,
	/** 拒绝 */
	REFUSE = 3,
	/** 通话中 */
	CALLING = 4,
	/** 挂断 */
	HANGUP = 5
}

export enum CallType {
	/** 视频通话 */
	VIDEO = 1,
	/** 音频通话 */
	AUDIO = 2
}
