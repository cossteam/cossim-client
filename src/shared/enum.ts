/** 错误状态码 */
export enum RESPONSE_CODE {
	/** 未认证 */
	Unauthorized = 401
}

/** 消息类型 */
export enum msgType {
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
	// /** 取消或拒绝视频通话 */
	// CANCEL_CALL = 13,
	// /** 取消或拒绝语音通话 */
	// CANCEL_VOICE = 14
}

// /** 消息阅读状态 */
// export enum MESSAGE_READ {
// 	/** 未读 */
// 	NOT_READ = 0,
// 	/** 已读 */
// 	READ = 1,
// 	/** 已删除 */
// 	DELETED = 2
// }

export const MESSAGE_READ = {
	/** 未读 */
	NOT_READ: false,
	/** 已读 */
	READ: true
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
export enum tooltipType {
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
	NONE = 'none',
	/** 设置为群公告 */
	NOTICE = 'notice',
	/** 设置撤回 */
	RECALL = 'recall'
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

/** 管理申请状态 */
export enum MangageApplyStatus {
	/** 拒绝 */
	REFUSE = 0,
	/** 同意 */
	ACCEPT = 1
}

/** 群聊成员列表类型 */
export enum MemberListType {
	/** 非本群成员 */
	NOTMEMBER = 'not_member',
	/** 本群成员 */
	MEMBER = 'member',
	/** 本群成员（仅展示） */
	MEMBERSHOW = 'member_show'
}

/** 通话状态 */
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

/** Socket 事件 */
export enum SocketEvent {
	/** 上线事件 */
	OnlineEvent = 1,
	/** 接收私聊消息 */
	PrivateChatsEvent = 3,
	/** 接收群聊消息 */
	GroupChatsEvent = 4,
	/** 接收到自己发送的消息 */
	SelfChatsEvent = 12,
	/** 接收群邀请 */
	GroupApplyListEvent = 11,
	/** 接收好友申请 */
	ApplyListEvent = 6,
	/** 接收好友同意或拒绝 */
	ApplyAcceptEvent = 7,
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
	GroupCallHangupEvent = 19,
	/** 用户在线状态 */
	UserOnlineEvent = 22,
	/** 接收到消息标注信息 */
	MessageLabelEvent = 23,
	/** 编辑消息事件 */
	MessageEditEvent = 24,
	/** 消息撤回 */
	MessageRecallEvent = 25,
	/** 推送好友在线状态 */
	FriendOnlineEvent = 27,
	/** 推送好友离线状态 */
	FriendOfflineEvent = 28,
	/** 用户离开群组通话事件 */
	UserLeaveGroupCallEvent = 31
}

// export enum MessageBurnAfterRead {
// 	/** 否 */
// 	NO = 0,
// 	/** 是 */
// 	YES = 1
// }

/** 消息是否阅后即焚 */
export const MessageBurnAfterRead = {
	/** 否 */
	NO: false,
	/** 是 */
	YES: true
}

// export enum MessageNoDisturb {
// 	/** 否 */
// 	NO = 0,
// 	/** 是 */
// 	YES = 1
// }

/** 消息是否免打扰 */
export const MessageNoDisturb = {
	/** 否 */
	NO: false,
	/** 是 */
	YES: true
}

/** 好友关系 */
export enum RelationStatus {
	/** 已删除 */
	NOT = 0,
	/** 正常 */
	YES = 1,
	/** 黑名单 */
	BLACK = 2
}

/** 群聊请求状态 */
export enum GroupApplyStatus {
	/** 等待验证 */
	WAIT = 0,
	/** 已通过 */
	PASS = 1,
	/** 已拒绝 */
	REFUSE = 2,
	/** 邀请发送者 */
	INVITE_SENDER = 3,
	/** 邀请接收者 */
	INVITE_RECEIVER = 4
}

/** 消息页表情和更多切换 */
export enum msgSendType {
	/** 文本 */
	TEXT = 0,
	/** 语音 */
	AUDIO = 1
}

/** 表情或者更多 */
export enum emojiOrMore {
	/** 表情 */
	EMOJI = 1,
	/** 更多 */
	MORE = 2,
	/** 无 */
	NONE = 0,
	/** 键盘 */
	KEYBOARD = 3
}
