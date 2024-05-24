import { Avatar, Badge, Flex, List } from 'antd'
// import VirtualList from 'rc-virtual-list'
import { memo } from 'react'
import { formatTime } from '@/utils/format-time'
// import { useWindowSize } from '@reactuses/core'
// import InfiniteScroll from 'react-infinite-scroll-component'

const headerHeight = 80

interface ChatListProps {
	data: ChatData[]
	height?: number
}

const ChatList: React.FC<ChatListProps> = memo((props) => {
	// const { height } = useWindowSize()

	// const onScroll = useCallback(() => {
	// 	console.log('onScroll')
	// }, [])

	// const loadMoreData = () => {}

	return (
		<div className="min-w-[320px] w750:w-auto w-full border-r h-screen overflow-auto">
			<div className="sticky top-0 z-10 bg-background" style={{ height: headerHeight }}>
				Header
			</div>
			{/* <InfiniteScroll
				dataLength={props.data.length}
				next={loadMoreData}
				hasMore={props.data.length < 30}
				loader={<Skeleton className="px-5" avatar paragraph={{ rows: 1 }} active />}
				endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
				scrollableTarget="scrollableDiv"
			> */}

			<div className="scrollbar-track--custom h-[calc(100vh-80px)] overflow-auto">
				<List
					dataSource={props.data}
					renderItem={(chat) => (
						<List.Item
							key={chat.dialog_id}
							extra={
								<Flex vertical align="flex-end">
									<span className="text-gray-400 text-xs mb-2">
										{formatTime(chat.last_message.send_time)}
									</span>
									<Badge count={chat.dialog_unread_count} size="small" />
								</Flex>
							}
							className="!px-5"
						>
							<List.Item.Meta
								avatar={<Avatar src={chat.dialog_avatar} size={48} />}
								title={chat.dialog_name}
								description={
									<div slot="description" className="text-nowrap text-ellipsis overflow-hidden">
										{chat.last_message.sender_info.name}:&nbsp;{chat.last_message.content}
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			</div>

			{/* </InfiniteScroll> */}
			{/* <List>
				<VirtualList
					data={props.data}
					height={height - headerHeight}
					itemHeight={70}
					itemKey="dialog_id"
					onScroll={onScroll}
				>
					{(chat) => (
						<List.Item
							key={chat.dialog_id}
							extra={
								<Flex vertical align="flex-end">
									<span className="text-gray-400 text-xs mb-2">
										{formatTime(chat.last_message.send_time)}
									</span>
									<Badge count={chat.dialog_unread_count} size="small" />
								</Flex>
							}
							className="!px-5"
						>
							<List.Item.Meta
								avatar={<Avatar src={chat.dialog_avatar} size={48} />}
								title={chat.dialog_name}
								description={
									<div slot="description" className="text-nowrap text-ellipsis overflow-hidden">
										{chat.last_message.sender_info.name}:&nbsp;{chat.last_message.content}
									</div>
								}
							/>
						</List.Item>
					)}
				</VirtualList>
			</List> */}
		</div>
	)
})

export default ChatList
