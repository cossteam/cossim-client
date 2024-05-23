export interface UserOptions {
	/*** @description 用户 id*/
	userId: string
	/*** @description 用户所有信息*/
	userInfo: any
	/** @description token */
	token: string
}

export interface UserStoreMethods {}

export interface CommonOptions {
	/**
	 * @description 当前主题  'light' | 'dark'
	 * @default 'light'
	 */
	theme: string
	/** @description 主题色 */
	themeColor: string
}

export interface CommonStoreMethods {
	/** @description 初始化操作，数据初始化，主题初始化等 */
	init(): Promise<void>
}

export type StoreSetMethods = (partial: unknown, replace?: boolean | undefined, action?: A | undefined) => void
export type StoreGetMethods<T, R> = {
	[K in keyof T as `get${Capitalize<string & K>}`]: () => R
}

// 用户仓库
export type UserStore = UserOptions & UserStoreMethods
// 通用仓库
export type CommonStore = CommonOptions & CommonStoreMethods
