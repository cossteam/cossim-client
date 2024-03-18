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
}
