import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MESSAGE_TYPE, MessageBurnAfterRead } from '@/shared'
// import { v4 as uuidv4 } from 'uuid'
import useUserStore from '@/stores/user'

/**
 * 生成消息
 * @param message 消息内容
 */
export function generateMessage(message?: any) {
	const userStore = useUserStore.getState()

	// TODO：查找好友，更具消息中的接收者 id 去查找对应的好友信息

	return {
		/** 是否阅后即焚 */
		is_burn_after_reading: MessageBurnAfterRead.NO,
		/** 是否标记 */
		is_label: MESSAGE_MARK.NOT_MARK,
		/** 是否已读 */
		is_read: MESSAGE_READ.NOT_READ,
		/** 消息发送状态 */
		msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
		/** 已读时间 */
		read_at: 0,
		/** 回复 id */
		reply_id: 0,
		/** 消息类型 */
		type: MESSAGE_TYPE.TEXT,
		/** 发送者信息 */
		sender_info: userStore.userInfo,
		/** @ 全体成员 */
		at_all_user: 0,
		/** @ 用户 */
		at_users: [],
		/** 群 id */
		group_id: 0,
		/** 消息 id */
		msg_id: Date.now(),
		/** 发送者 id */
		sender_id: userStore.userId,
		/** 接收者 id */
		receiver_id: '',
		/** 消息内容 */
		content: '',
		/** 回复 id */
		replay_id: 0,
		/** 创建时间 */
		created_at: Date.now(),
		/** 会话 id */
		dialog_id: 0,
		/** 阅后即焚时间 */
		burn_after_reading_time_out: 10,
		/** 接收者信息 */
		receiver_info: null,
		/** 传入参数 */
		...message
	}
}

/**
 * 生成会话
 * @param dialog 会话内容
 */
export function generateDialog(dialog: any) {
	return {
		/** 消息唯一标识 */
		// id: uuidv4(),
		/** 消息共享密钥 */
		sharedKey: '',
		/** 其他 */
		...dialog
	}
}
