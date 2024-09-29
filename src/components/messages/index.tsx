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
import { faker } from '@faker-js/faker'
import { MESSAGE_SEND_STATE, MESSAGE_TYPE } from '@/utils/enum'
// import generateTestMessages from './mock-message'
// import { isGroupDialog } from '@/utils/message'

const generateTestMessages = (): Message[] => {
    const messages = [];
    for (let i = 0; i < 100; i++) {
        messages.push({
            dialog_id: faker.datatype.number(),
            at_all_user: faker.datatype.boolean(),
            content: faker.lorem.sentence(),
            is_brun_after_reading: faker.datatype.boolean(),
            is_label: faker.datatype.boolean(),
            msg_id: faker.datatype.number(),
            msg_send_state: faker.helpers.arrayElement([MESSAGE_SEND_STATE.SENDING, MESSAGE_SEND_STATE.SUCCESS]),
            read_at: Date.now(),
            receiver_id: faker.datatype.string(),
            sender_id: faker.datatype.string(),
            receiver_info: {
                avatar: faker.image.avatar(),
                name: faker.name.firstName() + faker.name.lastName(),
                user_id: faker.datatype.string()
            },
            sender_info: {
                avatar: faker.image.avatar(),
                name: faker.name.firstName() + faker.name.lastName(),
                user_id: faker.datatype.string()
            },
            // type: faker.helpers.arrayElement([MESSAGE_TYPE.TEXT, MESSAGE_TYPE.NOTICE])
            type: faker.helpers.arrayElement([MESSAGE_TYPE.TEXT])
        });
    }
    return messages;
};

const Messages = () => {
    const { height } = useMobile()
    const { id } = useParams()

    // TODO src/components/messages/message-footer/message-input.tsx 
    // handleTextChange 每次输入内容都会导致重新渲染
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
