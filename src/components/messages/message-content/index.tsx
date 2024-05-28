import { useElementSize } from '@reactuses/core'
import { Flex, List } from 'antd'
import { memo, useEffect, useRef } from 'react'
// import VirtualList, { type ListRef } from 'rc-virtual-list'
// import { generateMessageList } from '@/mock/data'

// const data = generateMessageList(100)

const MessageContent = memo(() => {
	const messageContentRef = useRef<HTMLDivElement>(null)
	const [, height] = useElementSize(messageContentRef)
	// const listRef = useRef<ListRef>(null)

	useEffect(() => {
		console.log('height', height)
	}, [height])

	// const onScroll = useCallback(() => {}, [])

	return (
		<Flex className="flex-1" ref={messageContentRef}>
			<List bordered>
				{/* <VirtualList
					data={data}
					height={height}
					itemHeight={47}
					itemKey="msg_id"
					onScroll={onScroll}
					ref={listRef}
				>
					{(item: Message) => (
						<List.Item className={`mb-5 ${item.this_user ? 'flex-row-reverse' : ''}`}>
							<div className="flex-wrap">
								<div className="mr-10">
									<h3>{item.sender_info.name}</h3>
									<Avatar src={item.sender_info.avatar} />
								</div>
								<div>{item.send_at}</div>
							</div>
							<div className="bg-sky-300 w-28">{item.content}</div>
						</List.Item>
					)}
				</VirtualList> */}
			</List>
		</Flex>
	)
})

export default MessageContent
