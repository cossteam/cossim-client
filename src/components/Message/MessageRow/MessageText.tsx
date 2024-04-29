import ReadEditor from '@/components/ReadEditor/ReadEditor'
// import { msgType } from '@/shared'
import useMessageStore from '@/stores/message'
import clsx from 'clsx'
import { useMemo } from 'react'

interface MessageTextProps {
	item: Message
	isSelf: boolean
}

const MessageText: React.FC<MessageTextProps> = ({ item, isSelf }) => {
	const messageStore = useMessageStore()

	const replyMessage = useMemo(() => {
		const reply = { replyName: '', replyContent: '' }
		if (!item?.reply_id) return reply
		const message = messageStore.allMessages.find((msg) => msg?.msg_id === item?.reply_id)
		if (!message) {
			reply.replyContent = '消息已删除'
		} else {
			reply.replyName = message?.sender_info?.name
			reply.replyContent = message?.content
		}
		return reply
	}, [item?.reply_id])

	return (
		<div
			className={clsx(
				'rounded-lg',
				isSelf ? 'bg-primary text-white rounded-tr-none' : 'bg-bgPrimary rounded-tl-none read-editor-no-slef'
			)}
		>
			<ReadEditor
				className="py-2 px-3  break-all overflow-hidden select-none"
				content={item?.content}
				{...replyMessage}
			/>
			{item?.reply_emojis && !!item.reply_emojis.length && (
				<div className="px-2 py-[2px] flex flex-wrap gap-1 pb-2 select-none">
					{item.reply_emojis.map((item: any, index: number) => (
						<div
							className={clsx(
								'mr-1 text-1rem p-1  rounded-full text-[0.75rem] text-[#656464] flex items-center max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis',
								isSelf ? 'bg-[rgba(255,255,255,0.5)]' : 'bg-[rgba(0,0,0,0.1)]'
							)}
							key={index}
						>
							<span className="mr-1">{item?.reply_content}</span>
							<span className="inline-block overflow-x-hidden text-ellipsis whitespace-nowrap">
								{item?.reply_info?.name}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default MessageText
