import { tooltipType, msgSendType, emojiOrMore } from '@/shared'

/**
 * @description 用户状态
 */
export interface UserStoreOptions {
	/** 用户 id */
	userId: string
	/** 用户信息 */
	userInfo: any
	/** 用户 token */
	token: string
	/** 设备 id */
	deviceId: string
	/** 密钥对 */
	keyPair: { privateKey: string; publicKey: string }
}

/**
 * @description 用户仓库
 */
export type UserStore = UserStoreOptions & {
	/**
	 * @description 更新所有仓库信息, 可以只更新部分信息
	 *
	 */
	update: (options: Partial<UserStoreOptions>) => void
}

/**
 * @description 全局缓存状态
 */
export interface CacheStoreOptions {
	/** 是否首次进来 */
	firstOpened: boolean
	/** 缓存会话列表 */
	cacheDialogs: any[]
	/** 缓存联系人列表 */
	cacheContacts: any[]
	/** 缓存共享密钥 */
	cacheShareKeys: Array<{ user_id: string; shareKey: string }>
	/** 缓存群信息列表 */
	cacheGroup: any[]
	/** 未读消息数 */
	unreadCount: number
	/** 好友或群聊申请数 */
	applyCount: number
	/** 缓存的键盘高度, 默认 300 */
	keyboardHeight: number
	/** 搜索消息表名，主要用与搜索时获取对应表名的数据 */
	cacheSearchMessage: string[]
}

/**
 * @description 全局仓库
 */
export type CacheStore = CacheStoreOptions & {
	/**
	 * @description 初始化缓存
	 */
	init: () => void
	/**
	 * @description 更新首次进入状态
	 */
	updateFirstOpened: (firstOpened: boolean) => void
	/**
	 * @description 更新缓存会话列表
	 */
	updateCacheDialogs: (cacheDialogs: any[]) => void
	/**
	 * @description 更新键盘高度
	 */
	updateKeyboardHeight: (keyboardHeight: number) => void
	/**
	 * @description 更新未读消息数
	 * @param {number} unreadCount 未读消息数
	 */
	updateCacheUnreadCount: (unreadCount: number) => void
	/**
	 * @description 更新未处理请求
	 * @param {number} applyCount 未处理请求数
	 */
	updateCacheApplyCount: (applyCount: number) => void
	/**
	 * @description 更新搜索表
	 */
	updateCacheSearchMessage: (tableName: string) => void

	/**
	 * @description 更新消息列表
	 */
	updateCacheMessage: (cacheDialogs: any[]) => void

	/**
	 * @description 更新落后消息
	 */
	updateBehindMessage: (behindMessage: any[]) => void

	/**
	 * @description 添加缓存消息
	 *
	 * @param {any} message 消息
	 */
	addCacheMessage: (message: any) => Promise<void>
}

/**
 * @description 聊天状态
 */
export interface MessageStoreOptions {
	/** 消息列表 */
	messages: any[]
	/** 会话 id */
	dialogId: number
	/** 接收者 id， 可以是群 id， 也可以是用户 id */
	receiverId: string | number
	/** 所有消息，从缓存中取出 */
	allMessages: any[]
	/** 是否在底部 */
	isAtBottom: boolean
	/** 接收者信息 */
	receiverInfo: any
	/** 是否需要从服务器上拉取消息 */
	isNeedPull: boolean
	/** 是否是群聊 */
	isGroup: boolean
	/** 消息容器 */
	container: HTMLDivElement | null
	/** 当前选中的提示类型 */
	tipType: tooltipType
	/** 当前选中的消息 */
	selectedMessage: any
	/** 当前选中的消息列表 */
	selectedMessages: any[]
	/** 输入内容 */
	content: string
	/** 草稿 */
	draft: string
	/** 发送按钮类型 */
	sendType: msgSendType
	/** 表情或者更多按钮 */
	toolbarType: emojiOrMore
	/** 选择的表情 */
	selectedEmojis: string
	/** 是否需要清除输入框内容 */
	isClearContent: boolean
	/** 存储的表名 */
	tableName: string
	/** 消息总数 */
	total: number
	/** 占位高度 */
	placeholderHeight: number
	/** 当前需要手动关闭的提示 */
	manualTipType: tooltipType
	/** 是否 at 全体成员 */
	atAllUser: 0 | 1
	/** at 成员 id 列表 */
	atUsers: string[]
	/** 选中要转发的人员 */
	selectedForwardUsers: any[]
}

interface initOptions {
	dialogId: number
	receiverId: string | number
	isGroup: boolean
	receiverInfo?: any
}

/**
 * @description 聊天仓库
 */
export type MessageStore = MessageStoreOptions & {
	/**
	 * 初始化消息
	 * @param {string | number} dialogId 会话 id
	 */
	init: (options: initOptions) => Promise<void>
	/**
	 * 更新所有仓库信息, 可以只更新部分信息
	 * @param { Partial<MessageStoreOptions>} options
	 */
	update: (options: Partial<MessageStoreOptions>) => void
	/**
	 * 创建一条消息
	 * @param {any} message 消息内容
	 */
	createMessage: (message: any) => Promise<void>
	/**
	 * 更新消息
	 * @param {any} message	消息内容
	 * @param {number} 会话id
	 * @param {boolean} isPush 是否是推送消息
	 */
	updateMessage: (message: any, dialogId: number, isPush?: boolean) => Promise<void>
	// /**
	//  * 添加缓存消息
	//  * @param {any} message 消息
	//  */
	// addCacheMessage: (message: any) => Promise<void>
	/**
	 * 删除消息
	 *
	 * @param {any} message
	 */
	deleteMessage: (message: any) => void
}
