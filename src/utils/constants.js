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

/**
 * 发送类型 发送 ｜ 编辑 ｜ 回复
 */
export const sendType = {
	/** 发送 */
	SEND: 0,
	/** 编辑 */
	EDIT: 1,
	/** 回复 */
	REPLY: 2
}

/**
 * 提示框
 */
export const tooltipsType = {
	/** 转发 */
	FORWARD: 0,
	/** 编辑 */
	EDIT: 1,
	/** 删除 */
	DELETE: 2,
	/** 复制 */
	COPY: 3,
	/** 多选 */
	SELECT: 4,
	/** 回复 */
	REPLY: 5,
	/** 标注 */
	MARK: 6
}

/** 消息类型， 群聊消息， 私聊消息 */
export const chatType = {
	/** 私聊 */
	PRIVATE: 1,
	/** 群聊 */
	GROUP: 2
}

/** 是否阅后即焚 */
export const isBurn = {
	/** 阅后即焚 */
	TRUE: 1,
	/** 非阅后即焚 */
	FALSE: 0
}
