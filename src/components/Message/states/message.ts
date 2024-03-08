import { BehaviorSubject } from 'rxjs'
import { MessageStore } from '@/types/message'

const message: MessageStore = {
	opened: false,
	beforeOpened: false,
	receiver_info: {
		name: '',
		avatar: '',
		receiver_id: '',
		dialog_id: 0,
		status: 0,
		is_group: false
	},
	messages: []
}

export const msgStore = new BehaviorSubject<MessageStore>(message)


export default msgStore
