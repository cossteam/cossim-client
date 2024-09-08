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
// import { isGroupDialog } from '@/utils/message'

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
        console.log('messageList', messageList)
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
            <MessageContent messages={messageList} />
            <MessageFooter />
        </Flex>
    )
}

export default Messages
