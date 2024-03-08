import { PrivateChats } from '../db/user-db'

export interface ChatStore {
	/** 显示隐藏消息组件 */
	opened: boolean
	/** 对方的信息 */
	receiver_info: ReceiverInfo
	/** 消息列表 */
	messages: PrivateChats[]

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
	 */
	initMessage: (is_group: boolean, dialog_id: number, receiver_id: string) => Promise<void>
}

export interface ReceiverInfo {
	name: string
	avatar?: string
	dialog_id: number
	status?: number
	receiver_id: string | number
    is_group: boolean
	other_info?: { [key: string]: any },
}
