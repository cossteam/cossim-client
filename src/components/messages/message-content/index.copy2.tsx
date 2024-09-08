import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import MessageItem from './message-item'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import '@/styles/message.scss'

const LOAD_COUNT = 20

interface MessageContentProps {
    messages: Message[]
    start?: number
}

const MessageContent: React.FC<MessageContentProps> = ({ messages, start = 0 }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [, height] = useElementSize(parentRef)
    const virtuosoRef = useRef<VirtuosoHandle>(null)

    // =================== 消息数据状态处理 ===================
    const [loadData, setLoadData] = useState<Message[]>([])
    const [loadCount, setLoadCount] = useState<number>(LOAD_COUNT)
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false)

    useEffect(() => {
        setLoadData(messages.reverse().slice(start, start + loadCount))
    }, [messages, loadCount, start])

    // =================== 渲染消息列表（判断是否翻转消息列表） ===================
    // const messageItemRefs = useRef<Record<string, HTMLDivElement>>({})
    // const [reverse, setReverse] = useState<boolean>(true)
    // const [isStopCalculating, setIsStopCalculating] = useState<boolean>(false)

    const renderItem = useCallback(
        (item: Message) => {
            return (
                <MessageItem
                    message={item}
                    // ref={(ref) => ref && (messageItemRefs.current[index] = ref)}
                    key={item.msg_id}
                    item-key={item.msg_id}
                />
            )
        },
        [messages]
    )

    // useEffect(() => {
    //     if (!messageItemRefs.current) return
    //     if (!reverse) return
    //     if (isStopCalculating) return
    //     const heights = Object.values(messageItemRefs.current).map((ref) => ref.offsetHeight)
    //     const messageItemTotalHeight = heights.reduce((acc, cur) => acc + cur, 0)
    //     setReverse(messageItemTotalHeight > height)
    //     setIsStopCalculating(true)
    // }, [height, messageItemRefs])

    // =================== 往上加载或往下加载历史消息处理 ===================
    const atTopStateChange = useCallback(
        (isAtTop: boolean) => {
            if (isAtTop) {
                setLoadingHistory(true)
                setLoadCount(loadCount + LOAD_COUNT)
                virtuosoRef.current?.scrollToIndex(LOAD_COUNT)
                return
            }
            setLoadingHistory(false)
        },
        [loadCount, loadingHistory, virtuosoRef]
    )

    // TODO: 往下加载历史消息, 单 start 不能为 0 时触发
    const atBottomStateChange = useCallback(
        (isAtBottom: boolean) => {
            if (isAtBottom) {
                if (start === 0) return
                return
            }
        },
        [loadCount, loadingHistory, virtuosoRef, start]
    )

    // TODO: 完善新消息到达处理
    // =================== 新消息到达处理 ===================
    const followOutput = useCallback(
        (isAtBottom: boolean) => {
            return isAtBottom && !loadingHistory ? 'smooth' : false
        },
        [loadingHistory]
    )

    return (
        <Flex
            className="container--background flex-1 overflow-y-auto overflow-x-hidden relative "
            ref={parentRef}
            vertical
        >
            <Virtuoso
                className="virtuoso-list"
                height={height}
                data={loadData}
                increaseViewportBy={20}
                defaultItemHeight={300}
                ref={virtuosoRef}
                atTopStateChange={atTopStateChange}
                atBottomStateChange={atBottomStateChange}
                followOutput={followOutput}
                overscan={50}
                itemContent={(_, item) => renderItem(item)}
            />
        </Flex>
    )
}

export default MessageContent
