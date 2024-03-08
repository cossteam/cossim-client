import { useChatStore } from '@/stores/chat'
import clsx from 'clsx'
import { Button } from 'framework7-react'

const MessageFooter = () => {
	const chatStore = useChatStore()

	const add = () => {
		chatStore.updateMessages({
			content: '111',
			created_at: 0,
			dialog_id: 0,
			is_burn_after_reading: 0,
			is_label: 0,
			is_read: 0,
			read_at: 0,
			receiver_id: '',
			replay_id: 0,
			sender_id: '',
			type: 1,
			msg_id: Date.now()
		})
	}

	return (
		<div className={clsx('message-toolbar min-h-16 bg-bgPrimary bottom-0 w-full h-auto z-[99] relative')}>
			Footers
			<Button onClick={add}>add</Button>
		</div>
	)
}

export default MessageFooter
