import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTooltipsStore } from '@/stores/tooltips'
import { MESSAGE_READ } from '@/shared'
import { List, ListItem } from 'framework7-react'
import clsx from 'clsx'
import { RowProps } from './MessageVirtualList'
import { useChatStore } from '@/stores/chat'
import MessageItem from './MessageItem'
import { Element } from 'react-scroll'

interface MessageRowProps {
	selectChange: (...args: any[]) => void
	onSelect: (...args: any[]) => void
}

const MessageRow: React.FC<RowProps & MessageRowProps> = ({ index, setItemSize, selectChange, onSelect }) => {
	const chatStore = useChatStore()
	const tooltipStore = useTooltipsStore()
	const msg = useMemo(() => chatStore.messages[index], [chatStore.messages, index])
	const itemRef = useRef<HTMLDivElement | null>(null)

	// 查找回复消息
	const replyMessage = useCallback((msg_id: number) => chatStore.messages.find((v) => v?.msg_id === msg_id), [])

	// 计算每条消息的高度
	useEffect(() => {
		setItemSize(index, itemRef.current!.offsetHeight)
		// const doc = new DOMParser().parseFromString(msg?.content ?? '', 'text/html')
		// const imgs = doc.querySelectorAll('img')
		// const elementHeight = itemRef.current?.offsetHeight
		// // 替换图片
		// if (imgs.length) {
		// 	const image = new Image()
		// 	for (let i = 0; i < imgs.length; i++) {
		// 		image.src = imgs[i].src
		// 		image.onload = () => {
		// 			const elementHeight = itemRef.current?.offsetHeight
		// 			setItemSize(index, elementHeight!)
		// 		}
		// 	}
		// } else {
		// 	setItemSize(index, elementHeight!)
		// }
	}, [])

	const is_read = useMemo(() => msg?.is_read === MESSAGE_READ.READ, [msg])

	// useEffect(() => {
	// 	// 已读就不需要再多做处理, 下面是处理未读的消息 || isMe(msg.sender_id)
	// 	if (!is_read) {
	// 		// requestAnimationFrame(() => {
	// 		// setTimeout(() => {
	// 		// itemRef.current && ob.observe(itemRef.current)
	// 		chatStore.updateReads(msg)
	// 		// }, 1000)
	// 		// })
	// 	}
	// 	//  防止有漏掉的阅后即焚消息
	// 	if (is_read && msg.is_burn_after_reading === MessageBurnAfterRead.YES) {
	// 		chatStore.deleteMessage(msg.msg_id)
	// 		UserStore.delete(UserStore.tables.read_destroy, 'uid', msg.uid)
	// 	}
	// }, [])

	return (
		<div ref={itemRef} className={clsx('h-auto', !msg?.is_tips && !is_read && 'bg-gray-200')} style={{ zIndex: 1 }}>
			<Element name={`scroll_${index.toString()}`} id={`scroll_${index.toString()}`}>
				<List noChevron mediaList className="my-0">
					<ListItem
						key={index}
						className="coss_list_item "
						data-index={index}
						style={{ zIndex: 1 }}
						checkbox={tooltipStore.showSelect && !msg?.tips_msg_id}
						onChange={(e) => onSelect(e, msg)}
					>
						<MessageItem
							msg={msg}
							index={index}
							onSelect={selectChange}
							reply={msg?.reply_id !== 0 ? replyMessage(msg?.reply_id) : null}
							listItemRef={itemRef}
						/>
					</ListItem>
				</List>
			</Element>
		</div>
	)
}

export default MessageRow
