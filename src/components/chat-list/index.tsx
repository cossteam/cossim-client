import { Avatar, Flex, Badge, List, Typography, Skeleton } from 'antd'
import { useCallback, useMemo, useRef } from 'react'
import { formatTime } from '@/utils/format-time'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { $t } from '@/i18n'
import { useElementSize } from '@reactuses/core'
import useCacheStore from '@/stores/cache'
// import { Virtuoso } from 'react-virtuoso'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Virtuoso } from 'react-virtuoso'

// TODO: 1、时间、置顶排序 2、删除列表项  3、聊天列表项右侧功能按钮（待定）
const ChatList = () => {
    const navigate = useNavigate()
    const params = useParams()
    const listRef = useRef<HTMLDivElement>(null)
    const [height, width] = useElementSize(listRef)
    const cacheStore = useCacheStore()

    const renderItem = useCallback(
        (chat: ChatData) => {
            return (
                <List.Item
                    className={clsx(
                        '!px-3 select-none w750:hover:bg-background-hover cursor-pointer w-full',
                        Number(params.id) === chat.dialog_id && 'w750:!bg-primary'
                    )}
                    key={chat.dialog_id}
                    extra={<ChatListItemExtra chat={chat} />}
                    onClick={() => navigate(`/dashboard/message/${chat.dialog_id}`)}
                >
                    <List.Item.Meta
                        avatar={<ChatListItemAvatar chat={chat} />}
                        title={<ChatListItemTitle chat={chat} />}
                        description={<ChatListItemDescription chat={chat} />}
                    />
                </List.Item>
            )
        },
        [params.id, cacheStore.cacheChatList]
    )

    const count = useMemo(() => cacheStore.cacheChatList?.length || 0, [cacheStore.cacheChatList])

    const loadMoreData = () => {}

    return (
        <Flex className="flex-1 overflow-y-auto w-full" id="scrollableDiv" ref={listRef}>
            <InfiniteScroll
                style={{ width }}
                dataLength={count}
                next={loadMoreData}
                hasMore={false}
                loader={<Skeleton className="px-3" avatar paragraph={{ rows: 1 }} active />}
                scrollableTarget="scrollableDiv"
            >
                <List className="w-full" dataSource={cacheStore.cacheChatList} renderItem={renderItem} />
            </InfiniteScroll>
        </Flex>
        // <Flex className="flex-1" ref={listRef} vertical>
        //     <List className="w-full h-full flex-1">
        //         <Virtuoso
        //             className="w-full h-full"
        //             style={{ height }}
        //             height={height}
        //             data={cacheStore.cacheChatList}
        //             itemContent={(_, item) => renderItem(item)}
        //         />
        //     </List>
        // </Flex>
    )
}

const ChatListItemExtra: React.FC<{ chat: ChatData }> = ({ chat }) => {
    return (
        <Flex vertical align="flex-end">
            <Typography.Text className="text-gray-500 text-xs mb-2">
                {formatTime(chat.last_message.send_at)}
            </Typography.Text>
            <Badge className="badge" count={chat.dialog_unread_count} />
        </Flex>
    )
}

const ChatListItemTitle: React.FC<{ chat: ChatData }> = ({ chat }) => {
    return (
        <Typography.Paragraph className="!mb-0" ellipsis={{ rows: 1 }}>
            {chat.dialog_name}
        </Typography.Paragraph>
    )
}

const ChatListItemAvatar: React.FC<{ chat: ChatData }> = ({ chat }) => <Avatar src={chat.dialog_avatar} size={48} />

const ChatListItemDescription: React.FC<{ chat: ChatData }> = ({ chat }) => {
    const content = useMemo(() => {
        if (!chat.last_message?.content) return $t('[无消息内容]')
        return `${chat?.last_message?.sender_info?.name}：${chat.last_message?.content}`
    }, [])
    return (
        <Typography.Paragraph className="text-gray-500 !mb-0 -mt-[4px] text-sm" ellipsis={{ rows: 1 }}>
            {content}
        </Typography.Paragraph>
    )
}

export default ChatList
