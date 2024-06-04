import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { useCallback, useRef } from 'react'
import MessageItem from './message-item'
import '@/styles/message.scss'
import VirtualList from '@/components/virtualizer-list/virtual-list'

interface MessageContentProps {
    messages: Message[]
    start?: number
}

const MessageContent: React.FC<MessageContentProps> = ({ messages, start = 0 }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [, height] = useElementSize(parentRef)

    // =================== 渲染消息列表（判断是否翻转消息列表） ===================
    const renderItem = useCallback(
        (item: Message) => {
            return <MessageItem message={item} key={item.msg_id} item-key={item.msg_id} />
        },
        [messages]
    )

    return (
        <Flex
            className="container--background flex-1 overflow-y-auto overflow-x-hidden relative "
            ref={parentRef}
            vertical
        >
            <VirtualList
                data={messages.slice(-20).reverse()}
                reverse
                start={start}
                height={height}
                renderItem={renderItem}
            />
        </Flex>
    )
}

export default MessageContent
