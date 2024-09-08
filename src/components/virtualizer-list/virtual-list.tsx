import { useCallback, useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle, VirtuosoProps } from 'react-virtuoso'
import './virtual-list.scss'

interface VirtualListProps<T = any> {
    /**
     * 渲染数据，有多少条数就传多少条
     */
    data: T[]
    /**
     * 开始渲染的索引
     * @default 0
     */
    start?: number
    /**
     * 列表的高度
     * @default 300
     */
    height?: number
    /**
     * 渲染每条数据的方法
     * @param item 列表项数据
     * @returns 返回渲染的 JSX 元素
     * @example
     * ```
     * renderItem(item) {
     *   return <div className="message-item">{item.content}</div>
     * }
     * ```
     */
    renderItem: (item: T) => React.ReactNode
    /**
     * 每次加载的条数
     * @default 20
     */
    defaultLoadCount?: number
    /**
     * 是否反向渲染
     * @default false
     */
    reverse?: boolean
    /**
     * Virtuoso 组件的其他参数
     * @default {}
     */
    virtuosoOptiopns?: Partial<VirtuosoProps<any, any>>
    /**
     * 向上加载的方法
     * @default undefined
     */
    loadPrevious?: () => void
    /**
     * 向下加载的方法
     * @default undefined
     */
    loadNext?: () => void
}

const VirtualList: React.FC<VirtualListProps & Partial<VirtuosoProps<any, any>>> = ({
    data,
    start = 0,
    height = 300,
    renderItem,
    defaultLoadCount = 20,
    reverse = false,
    virtuosoOptiopns = {},
    loadPrevious,
    loadNext
}) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        if (firstLoad) setFirstLoad(false)
    }, [])

    // =================== 消息数据状态处理 ===================
    const [loadData, setLoadData] = useState<Message[]>([])
    const [loadCount, setLoadCount] = useState<number>(defaultLoadCount)
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false)

    useEffect(() => {
        setLoadData(data.slice(start, start + loadCount))
    }, [data, loadCount, start])

    // =================== 往上加载或往下加载历史消息处理 ===================
    const atTopStateChange = useCallback(
        (isAtTop: boolean) => {
            if (loadData.length >= data.length) return
            if (isAtTop) {
                setLoadingHistory(true)
                setLoadCount(loadCount + defaultLoadCount)
                virtuosoRef.current?.scrollToIndex(defaultLoadCount)
                loadPrevious?.()
                return
            }
            setLoadingHistory(false)
        },
        [loadCount, loadingHistory, virtuosoRef, data]
    )

    // TODO: 往下加载历史消息, 单 start 不能为 0 时触发
    const atBottomStateChange = useCallback(
        (isAtBottom: boolean) => {
            if (loadData.length >= data.length) return
            if (isAtBottom) {
                loadNext?.()
                if (start === 0) return
                return
            }
        },
        [loadCount, loadingHistory, virtuosoRef, start, data]
    )

    // =================== 新消息到达处理 ===================
    const followOutput = useCallback(
        (isAtBottom: boolean) => {
            return !firstLoad && isAtBottom && !loadingHistory ? 'smooth' : false
        },
        [loadingHistory]
    )

    return (
        <Virtuoso
            className="virtuoso-list"
            height={height}
            data={loadData}
            increaseViewportBy={20}
            defaultItemHeight={300}
            ref={virtuosoRef}
            atTopStateChange={atTopStateChange}
            atBottomStateChange={atBottomStateChange}
            overscan={50}
            itemContent={(_, item) => renderItem(item)}
            followOutput={!reverse ? false : followOutput}
            {...virtuosoOptiopns}
        />
    )
}

export default VirtualList
