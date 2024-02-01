/** 消息阅读状态 */
export const msgStatus = {
	/** 未读 */
	NOT_READ: 0,
	/** 已读 */
	READ: 1,
	/** 已删除 */
	DELETED: 2
}

/** 消息类型 */
export const msgType = {
	/** 文本 */
	TEXT: 1,
	/** 音频 */
	AUDIO: 2,
	/** 图片 */
	IMAGE: 3
}

/** 会话类型 */
export const dialogType = {
	/** 单聊 */
	SINGLE: 0,
	/** 群聊 */
	GROUP: 1
}

/** 会话状态 */
export const dialogStatus = {
	/** 正常 */
	NORMAL: 0,
	/** 删除 */
	DELETED: 1
}

/** 消息发送状态 */
export const sendState = {
	/** 发送失败 */
	ERROR: 0,
	/** 发送成功 */
	OK: 1,
	/** 发送中 */
	LOADING: 2
}
