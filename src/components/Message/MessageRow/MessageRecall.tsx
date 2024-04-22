import { $t, msgType } from '@/shared'
import { useMemo } from 'react'
// import { useMemo } from 'react'

interface MessageRecallProps {
	item: { [key: string]: any }
}

const MessageRecall: React.FC<MessageRecallProps> = ({ item }) => {
	const replyMsg = useMemo(() => item?.reply_msg, [item?.reply_msg])

	// 撤回表情回复不需要显示撤回提示
	if (replyMsg?.msg_type === msgType.EMOJI) return null

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
