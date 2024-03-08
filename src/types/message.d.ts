export interface MessageStore {
	/** 显示隐藏消息组件 */
	opened: boolean
	/** 对方的信息 */
	receiver_info: ReceiverInfo
	/** 消息列表 */
	messages: PrivateChats[]
	/** 显示前 */
	beforeOpened: boolean
}