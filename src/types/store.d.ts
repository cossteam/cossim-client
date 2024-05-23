/**
 * @description 主题 仓库
 */
export interface ThemeStore {
	/**
	 * @description 主题
	 * @default 'light'
	 */
	theme: 'light' | 'dark'
	/**
	 * @description 主题配置
	 */
	themeOptions: { [key: string]: string | number }
	/**
	 * @description 初始化，生成主题 css 变量
	 */
	init: () => Promise<void>
}

/**
 * @description 用户 仓库
 */
export interface UserStore {
	/**
	 * @description 用户 id
	 */
	userId: string
	/**
	 * @description 用户所有信息
	 */
	userInfo: any
	/**
	 * @description token
	 */
	token: string
}

/**
 * @description 全局 仓库
 */
export interface GlobalStore {
	/**
	 * @description 缓存消息列表
	 * @default []
	 */
	cachesMessages: any[]
	/**
	 * @description 缓存会话列表
	 * @default []
	 */
	cachesChats: any[]
	/**
	 * @description 缓存联系人
	 * @default []
	 */
	cachesContacts: any[]
	/**
	 * @description 初始化 把缓存内容填充到缓存
	 */
	init: () => void
}
