import UserStore from '@/db/user'
import msgStore from './message'

/**
 * 初始化消息
 *
 * @param is_group
 * @param dialog_id
 * @param receiver_id
 */
export const initMessage = async (is_group: boolean, dialog_id: number, receiver_id: string) => {
	const messages = await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', dialog_id)
	const userInfo = await UserStore.findOneById(UserStore.tables.friends, 'user_id', receiver_id)

	const receiver_info = {
		...userInfo,
		dialog_id,
		is_group
	}

	msgStore.next({
		...msgStore.value,
		messages,
		receiver_info,
        beforeOpened: true
	})
}
