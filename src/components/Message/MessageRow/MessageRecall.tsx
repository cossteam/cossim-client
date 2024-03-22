import { $t } from '@/shared'

interface MessageRecallProps {
	item: { [key: string]: any }
}

const MessageRecall: React.FC<MessageRecallProps> = ({ item }) => {
	return (
		<div className="message-tip">
			<div className="message-tip__text">
				{item?.sender_info?.name}
				&nbsp;{$t('撤回了一条消息')}
			</div>
		</div>
	)
}

export default MessageRecall
