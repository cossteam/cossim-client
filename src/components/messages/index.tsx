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
import storage from '@/storage'

const Messages = () => {
    const { height } = useMobile()
    const { id } = useParams()

    const messages = useMessagesStore()
    const cacheStore = useCacheStore()

    const isGroup = useMemo(() => !messages.chatInfo?.user_id, [messages.chatInfo])

    const messageList =
        useLiveQuery(() => {
            if (!id) return []
            return isGroup
                ? storage.group_messages.where('dialog_id').equals(Number(id)).toArray()
                : storage.private_messages.where('dialog_id').equals(Number(id)).toArray()
        }, [isGroup, id]) ?? []

    useEffect(() => {
        if (!id) return
        const chatInfo = cacheStore.cacheChatList.find((item) => item.dialog_id === Number(id))
        messages.update({
            chatInfo,
            isGroup,
            receiverId: isGroup ? chatInfo?.group_id : chatInfo?.user_id,
            draft: chatInfo?.draft || ''
        })
    }, [id])

    return (
        <Flex
            className="container--background bg-background3 flex-1 h-screen"
            style={{ height }}
            vertical
            align="stretch"
        >
            <MessageHeader />
            <MessageContent messages={messageList} />
            <MessageFooter />
        </Flex>
    )
}

export default Messages
