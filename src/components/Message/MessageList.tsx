import useMessageStore from '@/stores/new_message'
import MessageRow from './MessageRow'
import { useCallback, useEffect } from 'react'
import { emojiOrMore, msgType, tooltipType } from '@/shared'
import { List, ListItem } from 'framework7-react'

const MessageList = () => {
	const messageStore = useMessageStore()

	// 滚动到底部
	useEffect(() => {
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.container, messageStore.messages])

	useEffect(() => {
		if (messageStore.toolbarType === emojiOrMore.NONE) return
		messageStore.container?.scrollTo({
			top: messageStore.container?.scrollHeight
		})
	}, [messageStore.toolbarType])

	const handlerSelectChange = (checked: boolean, item: any) => {
		const selectedMessages = checked
			? [...messageStore.selectedMessages, item]
			: messageStore.selectedMessages.filter((msg: any) => msg.msg_id !== item.msg_id)
		messageStore.update({ selectedMessages })
	}

	const row = useCallback(
		(item: any, index: number) =>
			item?.msg_type !== msgType.NONE && (
				<ListItem
					key={index}
					checkbox={messageStore.manualTipType === tooltipType.SELECT}
					onChange={(e) => handlerSelectChange(e.target.checked, item)}
				>
					<MessageRow item={item} />
				</ListItem>
			),
		[messageStore.manualTipType]
	)

	return <List className="m-0">{messageStore.messages.map((item, index) => row(item, index))}</List>
}

export default MessageList
