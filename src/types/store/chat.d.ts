import { PrivateChats } from '../db/user-db'

export interface ChatStoreValue {
	/** 显示隐藏消息组件 */
	opened: boolean
	/** 对方的信息 */
	receiver_info: ReceiverInfo
	/** 消息列表 */
	messages: PrivateChats[]
	/** 显示前 */
	beforeOpened: boolean
	/** 跳转前 */
	beforeJump: boolean
	/** 页面当前位置是否处于最底部 */
	isAtBottom: boolean
	/** 所有消息 */
	allMessages: PrivateChats[]
}

export interface ChatStore extends ChatStoreValue {
	/**
	 * 更新显示隐藏
	 *
	 * @param opened
	 */
	updateOpened: (opened: boolean) => void

	/**
	 * 更新显示隐藏
	 *
	 * @param opened
	 */
	updateReceiverInfo: (userInfo: ReceiverInfo) => void

	/**
	 * 更新消息列表
	 *
	 * @param messages
	 */
	updateMessages: (message: PrivateChats) => void

	/**
	 * 初始化消息
	 *
	 * @param is_group
	 * @param dialog_id
	 * @param receiver_id
	 * @param name
	 */
	initMessage: (optons: {
		is_group: boolean
		dialog_id: number
		receiver_id: string
		name: string
		[key: string]: any
	}) => Promise<void>

	/**
	 * 显示前
	 *
	 * @param beforeOpened
	 */
	updateBeforeOpened: (beforeOpened: boolean) => void

	/**
	 * 更新是否处于最底部
	 *
	 * @returns
	 */
	updateIsAtBottom: (isAtBottom:boolean) => void

	/**
	 * 批量在头部添加消息
	 * 
	 * @param messages
	 * @returns 
	 */
	addMessages: (messages: PrivateChats[]) => void

	/**
	 * 更新离开前的消息
	 * 
	 * @returns 
	 */
	updateBeforeJump: (beforeJump: boolean) => void

	/**
	 * 离开后销毁
	 */
	destroy: () => void
}

export interface ReceiverInfo {
	name: string
	avatar?: string
	dialog_id: number
	status?: number
	receiver_id: string | number
	is_group: boolean
	[key: string]: any
}
