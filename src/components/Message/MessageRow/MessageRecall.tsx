import { $t } from '@/shared'
// import { useMemo } from 'react'

interface MessageRecallProps {
	item: { [key: string]: any }
}

const MessageRecall: React.FC<MessageRecallProps> = ({ item }) => {
	// const name = useMemo(() => (isMe(item?.sender_info?.user_id) ? $t('你') : $t('对方')), [item?.sender_info?.user_id])

	return (
		<div className="message-tip">
			<div className="message-tip__text">
				{/* {name} */}
				{item?.sender_info?.name}&nbsp;
				{$t('撤回了一条消息')}
			</div>
		</div>
	)
}

export default MessageRecall
