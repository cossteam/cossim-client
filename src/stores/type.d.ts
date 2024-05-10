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
	/** 上一次登录时间 */
	lastLoginTime: number
	/** 登录记录，用于记录退出登录前的登录记录 */
	loginNumber: number
	/** 是否新设备登录 */
	isNewLogin: boolean
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
	/** 联系人对象列表 */
	cacheContactsObj: any
	/** 缓存群列表 */
	cacheGroups: any[]
	/** 缓存群对象列表 */
	cacheGroupsObj: any
	/** 缓存共享密钥 */
	cacheShareKeys: Array<{ user_id: string; shareKey: string }>
	/** 未读消息数 */
	unreadCount: number
	/** 好友或群聊申请数 */
	applyCount: number
	/** 缓存的键盘高度, 默认 417 */
	keyboardHeight: number
	/** 搜索消息表名，主要用与搜索时获取对应表名的数据 */
	cacheSearchMessage: string[]
	/** 好友申请列表 */
	friendApply: any[]
	/** 群聊申请列表 */
	groupApply: any[]
	/** 键盘是否显示 */
	keyboardShow: boolean
	/** 密钥对 */
	cacheKeyPair: null | { privateKey: string; publicKey: string }
	/** 上一次登录时间 */
	lastLoginTime: number
	/** 会话消息总数 */
	totalMessages: Array<{ dialog_id: number; total: number }>
	/** 是否同步远程消息 */
	isSyncRemote: boolean
	/** 用户在线状态 */
	onlineStatus: Array<{ user_id: string; status: number }>
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
	 * @param {number} dialogId 会话id
	 * @param {any} message 消息
	 */
	updateCacheMessage: (message: any) => Promise<void>
	/**
	 * @description 更新落后消息
	 */
	updateBehindMessage: (behindMessage: any[]) => Promise<void>
	/**
	 * @description 添加缓存消息
	 * @param {any} message 消息
	 */
	addCacheMessage: (message: any) => Promise<void>
	/**
	 * @description 更新好友列表
	 * @param {any} message 消息
	 */
	updateCacheContacts: (contacts: any[]) => void
	/**
	 * @description 更新好友对象列表
	 * @param {any} message 消息
	 */
	updateCacheContactsObj: (contacts: any[]) => void
	/**
	 * @description 获取群聊列表
	 */
	updateCacheGroups: (contacts: any[]) => void
	/**
	 * @description 获取群聊对象列表
	 */
	updateCacheGroupsObj: (contacts: any[]) => void
	/**
	 * 更新所有缓存信息, 可以只更新部分信息
	 * @param { Partial<CacheStoreOptions>} options
	 * @param {boolean} isUpdateDB 是否需要更新本地数据库，默认不需要
	 */
	update: (options: Partial<CacheStoreOptions>, isUpdateDB?: boolean) => Promise<void>
	/**
	 * 获取缓存的内容
	 * @param {string} key 键
	 */
	get: (key: string) => Promise<any>
	/**
	 * 获取会话的消息
	 * @param dialogId
	 * @param ids
	 * @returns
	 */
	getDialogMessages: (dialogId: number, ...ids: number[]) => Promise<any[]>
	/**
	 * 设置缓存的内容
	 * @param key
	 * @param value
	 * @param isUpdateDB 是否需要更新本地内存中的数据，默认不需要
	 * @returns
	 */
	set: (key: string, value: any, isUpdateDB?: boolean) => Promise<void>
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
	/** 是否加载中 */
	isLoading: boolean
	/** 未读列表 id */
	unreadList: number[]
	/** 是否有群公告 */
	isGroupAnnouncement: boolean
	/** 是否在插入表情 */
	isEmojiFocus: boolean
	/** 是否需要滚动到底部 */
	isScrollBottom: boolean
	/** 群成员 */
	members: any[]
	/** 是否标注模式 */
	isLabel: boolean
}

interface initOptions {
	dialogId: number
	receiverId: string | number
	isGroup: boolean
	receiverInfo?: any
	isLabel?: boolean
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
	update: (options: Partial<MessageStoreOptions>) => Promise<void>
	/**
	 * 创建一条消息
	 * @param {any} message 消息内容
	 * @param {boolean} isCreateCacheMessage 是否创建缓存消息，默认为 true
	 */
	createMessage: (message: any, isCreateCacheMessage?: boolean) => Promise<void>
	/**
	 * 更新消息
	 * @param {any} message	消息内容
	 * @param {isupdateCacheMessage} 是否更新本地缓存消息，默认为 true
	 */
	updateMessage: (message: any, isupdateCacheMessage?: boolean) => Promise<void>
	/**
	 * 删除消息
	 *
	 * @param {any} message
	 */
	deleteMessage: (message: any) => Promise<void>
	/**
	 * 删除本地所有消息
	 *
	 * @param {number} dialogId 会话 idvoid
	 */
	deleteAllMessage: (dialogId: number) => Promise<void>
	/**
	 * 从头部添加消息，每次添加 15 条
	 */
	unshiftMessage: () => Promise<void>
	/**
	 * 更新未读列表
	 * @param {number} msgId 消息 id
	 */
	updateUnreadList: (msgId: number) => Promise<void>

	/**
	 * 消息是否加载完毕
	 */
	isEOF: () => boolean
}
