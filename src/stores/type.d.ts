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
	 * @description 更新未读消息数
	 */
	updateUnreadCount: (unreadCount: number) => void
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
}
