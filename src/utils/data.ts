import { MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND, MessageBurnAfterRead, msgType } from '@/shared'
import useMessageStore from '@/stores/message'
import { v4 as uuidv4 } from 'uuid'
import useUserStore from '@/stores/user'

/**
 * 生成消息
 * @param message 消息内容
 */
export function generateMessage(message?: Partial<Message>): Message {
	const userStore = useUserStore.getState()
	const messageStore = useMessageStore.getState()

	// TODO：查找好友，更具消息中的接收者 id 去查找对应的好友信息

	const msg: any = {
		uid: uuidv4(),
		msg_id: Date.now(),
		sender_id: userStore.userId,
		receiver_id: messageStore.receiverId,
		content: '',
		msg_type: msgType.TEXT,
		reply_id: 0,
		is_read: MESSAGE_READ.READ,
		read_at: Date.now(),
		created_at: Date.now(),
		send_at: Date.now(),
		dialog_id: messageStore.dialogId,
		is_label: false,
		is_burn_after_reading: MessageBurnAfterRead.NO,
		burn_after_reading_time_out: 0,
		sender_info: {
			user_id: userStore.userId,
			avatar: userStore.userInfo?.avatar,
			name: userStore.userInfo?.nickname
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
