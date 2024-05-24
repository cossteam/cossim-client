export interface UserOptions {
	/*** @description 用户 id*/
	userId: string
	/*** @description 用户所有信息*/
	userInfo: any
	/** @description token */
	token: string
}

export interface UserStoreMethods {
	/** @description 更新某个值 */
	update: (options: Partial<UserOptions>) => Promise<void>
}

export interface CommonOptions {
	/**
	 * @description 当前主题  'light' | 'dark'
	 * @default 'light'
	 */
	theme: 'light' | 'dark'
	/** @description 主题色 */
	themeColor: string
	/** @description 语言 */
	lang: string
}

export interface CommonStoreMethods {
	/** @description 初始化操作，数据初始化，主题初始化等 */
	init(): Promise<void>
	/** @description 更新某个值 */
	update: (options: Partial<CommonOptions>) => Promise<void>
}

// 用户仓库
export type UserStore = UserOptions & UserStoreMethods
// 通用仓库
export type CommonStore = CommonOptions & CommonStoreMethods
