import { Flex } from 'antd'
import MessageHeader from './message-header'
import MessageContent from './message-content'
import MessageFooter from './message-footer'
import useMobile from '@/hooks/useMobile'
import useMessagesStore from '@/stores/messages'
import { useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import useCacheStore from '@/stores/cache'
import { useLiveQuery } from 'dexie-react-hooks'
import { fa } from '@faker-js/faker'
import { MESSAGE_SEND_STATE, MESSAGE_TYPE } from '@/utils/enum'
// import { isGroupDialog } from '@/utils/message'

const generateTestMessages = (): Message[] => {
    return [
        {
            dialog_id: 1,
            at_all_user: false,
            content: "你好，最近怎么样？",
            is_brun_after_reading: false,
            is_label: false,
            msg_id: 1001,
            msg_send_state: MESSAGE_SEND_STATE.SENDING,
            read_at: Date.now(),
            receiver_id: "user002",
            sender_id: "user001",
            receiver_info: {
                avatar: "https://example.com/avatar2.jpg",
                name: "张三",
                user_id: "user002"
            },
            sender_info: {
                avatar: "https://example.com/avatar1.jpg",
                name: "李四",
                user_id: "user001"
            },
            type: MESSAGE_TYPE.TEXT
        },
        {
            dialog_id: 1,
            at_all_user: false,
            content: "我很好，谢谢关心！你呢？",
            is_brun_after_reading: false,
            is_label: true,
            msg_id: 1002,
            msg_send_state: MESSAGE_SEND_STATE.SUCCESS,
            read_at: Date.now(),
            receiver_id: "user001",
            sender_id: "user002",
            receiver_info: {
                avatar: "https://example.com/avatar1.jpg",
                name: "李四",
                user_id: "user001"
            },
            sender_info: {
                avatar: "https://example.com/avatar2.jpg",
                name: "张三",
                user_id: "user002"
            },
            type: MESSAGE_TYPE.TEXT
        },
        {
            dialog_id: 1,
            at_all_user: true,
            content: "大家注意，明天有重要会议！",
            is_brun_after_reading: false,
            is_label: false,
            msg_id: 1003,
            msg_send_state: MESSAGE_SEND_STATE.SUCCESS,
            read_at: Date.now(),
            receiver_id: "group001",
            sender_id: "user003",
            receiver_info: {
                avatar: "https://example.com/group_avatar.jpg",
                name: "项目组",
                user_id: "group001"
            },
            sender_info: {
                avatar: "https://example.com/avatar3.jpg",
                name: "王五",
                user_id: "user003"
            },
            type: MESSAGE_TYPE.NOTICE
        }
    ];
};

const Messages = () => {
    const { height } = useMobile()
    const { id } = useParams()

    const messages = useMessagesStore()
    const cacheStore = useCacheStore()

    function isGroupDialog(chatInfo: ChatData): any {
        console.log('chatInfo', chatInfo)
    }

    // TODO: 判断正确的 group_id 和 user_id
    const isGroup = useMemo(() => messages.chatInfo && isGroupDialog(messages.chatInfo), [messages.chatInfo])

    const messageList =
        useLiveQuery(() => {
            if (!id) return []
            return isGroup
                ? storage.group_messages.where('dialog_id').equals(Number(id)).toArray()
                : storage.private_messages.where('dialog_id').equals(Number(id)).toArray()
        }, [isGroup, id]) ?? []

    useEffect(() => {
        // console.log('messageList', messageList)
    }, [messageList])

    useEffect(() => {
        if (!id) return
        if (!cacheStore.cacheChatList) return
        const chatInfo = cacheStore.cacheChatList?.find((item) => item?.dialog_id === Number(id))
        messages.update({
            chatInfo,
            // isGroup,
            receiverId: isGroup ? chatInfo?.group_id : chatInfo?.user_id,
            draft: chatInfo?.draft || ''
        })
    }, [id, cacheStore.cacheChatList])

    return (
        <Flex className="container--background bg-background3 flex-1" style={{ height }} vertical align="stretch">
            <MessageHeader />
            <MessageContent messages={generateTestMessages()} />
            <MessageFooter />
        </Flex>
    )
}

export default Messages
