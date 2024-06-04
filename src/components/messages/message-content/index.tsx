import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { generateMessageList } from '@/mock/data'
import MessageItem from './message-item'
import InfiniteScroll from '@/components/infinite-scroll'
// import { useLiveQuery } from 'dexie-react-hooks'
// import storage from '@/storage'
// import VirtualList from '@/components/virtualizer-list/virtual-list'

interface MessageContentProps {
    messages: Message[]
}

// TODO: 优化虚拟列表
const MessageContent: React.FC<MessageContentProps> = ({ messages }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [, height] = useElementSize(parentRef)

    // const [data, setData] = useState<Message[]>([])
    // const [, setLoading] = useState<boolean>(false)
    const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false)

    const count = useMemo(() => messages.length, [messages])

    // 异步加载数据，防止阻塞渲染
    const loadData = async () => {
        // setLoading(true)
        // const newData = await new Promise<Message[]>((resolve) => {
        //     resolve(generateMessageList(50))
        // })
        // setData(newData)
    }

    const loadMoreData = async () => {
        if (isFetchingNextPage) return
        setIsFetchingNextPage(true)
        // const newData = await new Promise<Message[]>((resolve) => {
        //     setTimeout(() => {
        //         resolve(generateMessageList(50))
        //     }, 0)
        // })
        // setData((prevData) => [...newData, ...prevData])
        setIsFetchingNextPage(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const messageItemRefs = useRef<Record<string, HTMLDivElement>>({})
    const [reverse, setReverse] = useState<boolean>(true)

    const renderItem = useCallback(
        (index: number) => {
            return (
                <MessageItem
                    message={messages[index]}
                    ref={(ref) => ref && (messageItemRefs.current[index] = ref)}
                    key={index}
                />
            )
        },
        [messages]
    )

    // 计算元素高度，是否需要翻转消息列表
    useEffect(() => {
        if (!messageItemRefs.current) return
        const heights = Object.values(messageItemRefs.current).map((ref) => ref.offsetHeight)
        const messageItemTotalHeight = heights.reduce((acc, cur) => acc + cur, 0)
        setReverse(messageItemTotalHeight > height)
    }, [height, messageItemRefs])

    return (
        <Flex
            className="container--background flex-1 overflow-y-auto overflow-x-hidden relative"
            style={{ height, contain: 'strict' }}
            ref={parentRef}
            vertical
        >
            {/* <VirtualizerList
				count={count}
				listHeight={height}
				renderItem={renderItem}
				ref={virtualizerRef}
				loading
				isScrollToEnd
			/> */}

            {count ? (
                <InfiniteScroll dataLength={count} next={loadMoreData} height={height} reverse={reverse}>
                    {messages.reverse().map((_, index) => renderItem(index))}
                </InfiniteScroll>
            ) : (
                <>&nbsp;</>
            )}

            {/* <VirtualList data={data} itemHeight={50} height={height} children={renderItem} /> */}
        </Flex>
    )
}

export default MessageContent
