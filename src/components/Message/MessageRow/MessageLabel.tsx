import { $t, MESSAGE_MARK } from '@/shared'
import ReadEditor from '@/components/ReadEditor/ReadEditor'
import { useMemo } from 'react'
// import { toJson } from '@/utils'

interface MessageLabelProps {
	item: { [key: string]: any }
}

const MessageLabel: React.FC<MessageLabelProps> = ({ item }) => {
	const text = useMemo(() => (item?.is_label === MESSAGE_MARK.MARK ? '标注了' : '取消标注'), [item.is_label])
	// const content = useMemo(() => toJson(item?.content)?.content, [item.content])

	return (
		<div className="message-tip">
			<div className="message-tip__text">
				{item?.sender_info?.name}
				&nbsp;{$t(text)}&nbsp; &quot;
				<ReadEditor content={item?.content} className="text-[0.7rem] px-0" />
				&quot;
			</div>
		</div>
	)
}

export default MessageLabel
