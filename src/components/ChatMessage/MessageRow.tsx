import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RowProps } from './MessageVariableSizeList'
import { useMessageStore } from '@/stores/message'
import { useTooltipsStore } from '@/stores/tooltips'
import { MESSAGE_READ, MessageBurnAfterRead } from '@/shared'
import { List, ListItem } from 'framework7-react'
import MessageBox from './MessageBox'
import clsx from 'clsx'
import UserStore from '@/db/user'

interface MessageRowProps {
	selectChange: (...args: any[]) => void
	onSelect: (...args: any[]) => void
	el: RefObject<HTMLDivElement | null>
}

const MessageRow: React.FC<RowProps & MessageRowProps> = ({ index, setItemSize, selectChange, onSelect, el }) => {
	const msgStore = useMessageStore()
	const tooltipStore = useTooltipsStore()
	const msg = useMemo(() => msgStore.messages[index], [index])
	const itemRef = useRef<HTMLDivElement | null>(null)
	const [read, setRead] = useState<boolean>(true)

	// 查找回复消息
	const replyMessage = useCallback((msg_id: number) => msgStore.messages.find((v) => v?.msg_id === msg_id), [])

	// 计算每条消息的高度
	useEffect(() => {
		const doc = new DOMParser().parseFromString(msg?.content ?? '', 'text/html')
		const imgs = doc.querySelectorAll('img')
		const elementHeight = itemRef.current?.offsetHeight
		// 替换图片
		if (imgs.length) {
			const image = new Image()
			for (let i = 0; i < imgs.length; i++) {
				image.src = imgs[i].src
				image.onload = () => {
					const elementHeight = itemRef.current?.offsetHeight
					setItemSize(index, elementHeight!)
				}
			}
		} else {
			setItemSize(index, elementHeight!)
		}
	}, [])

	// 处理显示区域的消息，做已读、阅后即焚的操作
	const handlerObserver = (entries: IntersectionObserverEntry[]) => {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting) {
				// !isMe(msg.sender_id) &&
				msgStore.readMessage([msg])
				setRead(true)
				// 如果消息是阅后即焚
				if (msg?.is_burn_after_reading === MessageBurnAfterRead.YES) {
					const time = msgStore.userInfo?.preferences?.open_burn_after_reading_time_out ?? 10
					// 添加进去
					UserStore.add(UserStore.tables.read_destroy, {
						uid: msg.uid,
						msg_id: msg?.msg_id,
						read_time: Date.now(),
						self_destruct_time: time
					})
					const timer = setTimeout(() => {
						msgStore.deleteMessage(msg.msg_id)
						UserStore.delete(UserStore.tables.read_destroy, 'uid', msg.uid)
						clearTimeout(timer)
					}, time * 1000)
				}

				// 取消监听
				itemRef.current && ob.unobserve(itemRef.current)
			}
		})
	}
	const ob = useMemo(() => new IntersectionObserver(handlerObserver, { root: el.current! }), [])

	const is_read = useMemo(() => msg?.is_read === MESSAGE_READ.READ, [read])

	useEffect(() => {
		// 已读就不需要再多做处理, 下面是处理未读的消息 || isMe(msg.sender_id)
		if (!is_read) {
			setRead(false)
			requestAnimationFrame(() => {
				setTimeout(() => {
					itemRef.current && ob.observe(itemRef.current)
				}, 1000)
			})
		}
        
	}, [])

	return (
		<div ref={itemRef} className={clsx('h-auto', !msg?.is_tips && !is_read && !read && 'bg-gray-200')} style={{ zIndex: 1 }}>
			<List noChevron mediaList className="my-0">
				<ListItem
					key={index}
					className="coss_list_item "
					data-index={index}
					style={{ zIndex: 1 }}
					checkbox={tooltipStore.showSelect && !msg?.tips_msg_id}
					onChange={(e) => onSelect(e, msg)}
				>
					<MessageBox
						msg={msg}
						index={index}
						onSelect={selectChange}
						reply={msg?.reply_id !== 0 ? replyMessage(msg?.reply_id) : null}
						listItemRef={itemRef}
					/>
				</ListItem>
			</List>
		</div>
	)
}

export default MessageRow
