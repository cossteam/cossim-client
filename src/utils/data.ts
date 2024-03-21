import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MessageBurnAfterRead, msgType } from '@/shared'
import useMessageStore from '@/stores/new_message'
// import { v4 as uuidv4 } from 'uuid'
import useUserStore from '@/stores/user'

/**
 * 生成消息
 * @param message 消息内容
 */
export function generateMessage(message?: any) {
	const userStore = useUserStore.getState()
	const messageStore = useMessageStore.getState()

	// TODO：查找好友，更具消息中的接收者 id 去查找对应的好友信息

	const msg: any = {
		msg_id: 0,
		sender_id: userStore.userId,
		receiver_id: messageStore.receiverId,
		content: '',
		type: msgType.TEXT,
		replay_id: 0,
		is_read: MESSAGE_READ.READ,
		read_at: Date.now(),
		created_at: Date.now(),
		dialog_id: messageStore.dialogId,
		is_label: MESSAGE_MARK.NOT_MARK,
		is_burn_after_reading: MessageBurnAfterRead.NO,
		burn_after_reading_time_out: 0,
		sender_info: {
			user_id: userStore.userId,
			avatar: userStore.userInfo?.avatar,
			name: userStore.userInfo?.name
		},
		receiver_info: {
			user_id: messageStore.receiverId,
			avatar: messageStore.receiverInfo?.dialog_avatar,
			name: messageStore.receiverInfo?.dialog_name
		},
		msg_send_state: MESSAGE_SEND.SEND_SUCCESS
	}

	if (messageStore.isGroup) {
		msg['group_id'] = messageStore.receiverId
		msg['at_all_user'] = 0
		msg['at_users'] = []
		// TODO: 添加群字段
	}

	return { ...msg, ...message }
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
