import { Avatar, Flex, Badge, List, Typography } from 'antd'
import React, { useCallback, useMemo } from 'react'
import { formatTime } from '@/utils/format-time'
import { headerHeight } from '@/components/layout/layout-header'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import VirtualizerList from '@/components/virtualizer-list'
import useMobile from '@/hooks/useMobile'
import { $t } from '@/i18n'

interface ChatListProps {
    data: ChatData[]
    height?: number
}

// TODO: 1、时间、置顶排序 2、删除列表项  3、聊天列表项右侧功能按钮（待定）
const ChatList: React.FC<ChatListProps> = (props) => {
    const { height } = useMobile()
    const navigate = useNavigate()
    const params = useParams()

    const renderItem = useCallback(
        (index: number) => {
            const chat = props.data[index]
            return (
                <List.Item
                    className={clsx(
                        '!px-3 select-none w750:hover:bg-background-hover cursor-pointer w-full',
                        Number(params.id) === chat.dialog_id && 'w750:!bg-primary'
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
            )
        },
        [params.id, props.data]
    )

    return (
        <List>
            <VirtualizerList
                listHeight={height - headerHeight}
                count={props.data?.length || 0}
                renderItem={renderItem}
            />
        </List>
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
        <Typography.Paragraph className="text-gray-500 !mb-0 -mt-[4px] text-base" ellipsis={{ rows: 1 }}>
            {content}
        </Typography.Paragraph>
    )
}

export default ChatList
