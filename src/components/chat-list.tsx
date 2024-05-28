import { Avatar, Badge, Flex, List, Typography } from 'antd'
import VirtualList from 'rc-virtual-list'
import React, { memo, useCallback } from 'react'
import { formatTime } from '@/utils/format-time'
import { useWindowSize } from '@reactuses/core'
// import InfiniteScroll from 'react-infinite-scroll-component'
import { headerHeight } from '@/components/layout/layout-header'
import { useNavigate, useParams } from 'react-router'
import clsx from 'clsx'

interface ChatListProps {
	data: ChatData[]
	height?: number
}

const ChatListItemExtra: React.FC<{ chat: ChatData }> = memo(({ chat }) => {
	return (
		<Flex vertical align="flex-end">
			<Typography.Text className="text-gray-500 text-xs mb-2">
				{formatTime(chat.last_message.send_time)}
			</Typography.Text>
			<Badge count={chat.dialog_unread_count} />
		</Flex>
	)
})

const ChatListItemTitle: React.FC<{ chat: ChatData }> = memo(({ chat }) => {
	return (
		<Typography.Paragraph className="!mb-0" ellipsis={{ rows: 1 }}>
			{chat.dialog_name}
		</Typography.Paragraph>
	)
})

const ChatListItemAvatar: React.FC<{ chat: ChatData }> = memo(({ chat }) => (
	<Avatar src={chat.dialog_avatar} size={48} />
))

const ChatListItemDescription: React.FC<{ chat: ChatData }> = memo(({ chat }) => {
	return (
		<Typography.Paragraph className="text-gray-500 !mb-0 -mt-[4px] text-base" ellipsis={{ rows: 1 }}>
			{chat.last_message.sender_info.name}:&nbsp;{chat.last_message.content}
		</Typography.Paragraph>
	)
})

const ChatList: React.FC<ChatListProps> = memo((props) => {
	const { height } = useWindowSize()
	const navigate = useNavigate()
	const params = useParams()

	const onScroll = useCallback(() => {
		// console.log('onScroll')
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
						className={clsx(
							'!px-3 select-none hover:bg-background-hover cursor-pointer',
							Number(params.id) === chat.dialog_id && '!bg-primary'
						)}
						key={chat.dialog_id}
						extra={<ChatListItemExtra chat={chat} />}
						onClick={() => navigate(`/dashboard/${chat.dialog_id}`)}
					>
						<List.Item.Meta
							avatar={<ChatListItemAvatar chat={chat} />}
							title={<ChatListItemTitle chat={chat} />}
							description={<ChatListItemDescription chat={chat} />}
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
