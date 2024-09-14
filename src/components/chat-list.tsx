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
import { faker } from '@faker-js/faker'


const generateMockChatDataArray = (length: number): ChatData[] => {
    const chatDataArray: ChatData[] = []

    for (let i = 0; i < length; i++) {
        const chatData: ChatData = {
            dialog_avatar: faker.image.avatar(),
            dialog_name: faker.name.fullName(),
            dialog_create_at: faker.date.past().getTime(),
            dialog_id: faker.datatype.number({ min: 1, max: 1000 }),
            dialog_type: faker.datatype.number({ min: 0, max: 1 }), // 0 or 1 for type
            dialog_unread_count: faker.datatype.number({ min: 0, max: 50 }),
            top_at: faker.date.recent().getTime(),
            group_id: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 1000 }) : undefined,
            user_id: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 1000 }) : undefined,
            last_message: {
                content: faker.lorem.sentence(),
                is_burn_after_reading: faker.datatype.boolean(),
                is_label: faker.datatype.boolean(),
                msg_id: faker.datatype.number({ min: 1, max: 10000 }),
                msg_type: faker.datatype.number({ min: 1, max: 5 }), // Different message types
                send_at: faker.date.recent().getTime(),
                sender_id: faker.datatype.uuid(),
                sender_info: {
                    user_id: faker.datatype.uuid(),
                    name: faker.name.fullName(),
                    avatar: faker.image.avatar(),
                },
                reply: faker.datatype.number({ min: 0, max: 100 }),
                receiver_info: {
                    avatar: faker.image.avatar(),
                    name: faker.name.fullName(),
                    user_id: faker.datatype.uuid(),
                }
            },
            draft: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
        }

        chatDataArray.push(chatData)
    }

    return chatDataArray
}


// TODO: 1、时间、置顶排序 2、删除列表项  3、聊天列表项右侧功能按钮（待定）
const ChatList = () => {
    const navigate = useNavigate()
    const params = useParams()
    const listRef = useRef<HTMLDivElement>(null)
    const [width] = useElementSize(listRef)
    const cacheStore = useCacheStore()

    const chatDataArray = useMemo(() => generateMockChatDataArray(10), [])

    const renderItem = useCallback(
        (chat: ChatData) => {
            return (
                <List.Item
                    // className={clsx(
                    //     '!px-3 select-none w750:hover:bg-background-hover cursor-pointer w-full',
                    //     Number(params.id) === chat.dialog_id && 'w750:!bg-primary'
                    // )}
                    className={clsx(
                        '!px-3 select-none w750:hover:bg-background-hover cursor-pointer w-full',
                        Number(params.id) === chat.dialog_id && 'w750:!bg-[#C9ECDA]'
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

    // const count = useMemo(() => cacheStore.cacheChatList?.length || 0, [cacheStore.cacheChatList])

    const count = useMemo(() => chatDataArray?.length || 0, [chatDataArray])

    const loadMoreData = () => { }

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
                <List split={false}
                    className="w-full" dataSource={chatDataArray} renderItem={renderItem} />
            </InfiniteScroll>
        </Flex>
        // // <Flex className="flex-1" ref={listRef} vertical>
        //     {/* <List className="w-full h-full flex-1">
        //         <Virtuoso
        //             className="w-full h-full"
        //             style={{ height }}
        //             height={height}
        //             data={cacheStore.cacheChatList}
        //             itemContent={(_, item) => renderItem(item)}
        //         />
        //     </List> */}
        // // </Flex>
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
        <Typography.Paragraph className="text-gray-500 !mb-0 -mt-[4px] text-xs" ellipsis={{ rows: 1 }}>
            {content}
        </Typography.Paragraph>
    )
}

export default ChatList
