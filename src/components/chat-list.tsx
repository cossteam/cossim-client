import { Avatar, Badge, Flex, List } from 'antd'
import VirtualList from 'rc-virtual-list'
import { memo, useCallback } from 'react'
import { formatTime } from '@/utils/format-time'
import { useWindowSize } from '@reactuses/core'
// import InfiniteScroll from 'react-infinite-scroll-component'
import { headerHeight } from '@/components/layout/layout-header'

interface ChatListProps {
	data: ChatData[]
	height?: number
}

const ChatList: React.FC<ChatListProps> = memo((props) => {
	const { height } = useWindowSize()

	const onScroll = useCallback(() => {
		console.log('onScroll')
	}, [])

	return (
		<List>
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
		</List>
	)
})

export default ChatList

// bak
{
	/* <InfiniteScroll
dataLength={props.data.length}
next={loadMoreData}
hasMore={props.data.length < 30}
loader={<Skeleton className="px-5" avatar paragraph={{ rows: 1 }} active />}
endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
scrollableTarget="scrollableDiv"
> 

<div
className="scrollbar-track--custom  overflow-auto cursor-pointer"
style={{ height: height - headerHeight }}
>
<List
dataSource={props.data}
renderItem={(chat) => (
	<List.Item
		className="!px-3 select-none hover:bg-background-hover cursor-pointer"
		key={chat.dialog_id}
		extra={
			<Flex vertical align="flex-end">
				<span className="text-gray-400 text-xs mb-2">
					{formatTime(chat.last_message.send_time)}
				</span>
				<Badge count={chat.dialog_unread_count} size="small" />
			</Flex>
		}
	>
		<List.Item.Meta
			avatar={<Avatar src={chat.dialog_avatar} size={48} />}
			title={chat.dialog_name}
			description={
				<div className="text-nowrap line-clamp-1 text-ellipsis overflow-hidden">
					{chat.last_message.sender_info.name}:&nbsp;{chat.last_message.content}
				</div>
			}
		/>
	</List.Item>
)}
/>
</div> 
</InfiniteScroll>  */
}
