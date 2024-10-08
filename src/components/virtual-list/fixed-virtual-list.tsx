import { useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'es-toolkit/function'
import { ScrollArea } from '@/ui/scroll-area'

interface FixedVirtualListProps<T> {
    /** 每一项的高度 */
    itemHeight?: number
    /** 渲染每一项的回调函数 */
    renderItem: (item: T, index: number) => React.ReactNode
    /** 每页显示的数量 */
    pageSize?: number
    /** 缓冲区大小 */
    buffer?: number
    /** 数据 */
    data: T[]
    /** 加载更多回调函数 */
    loadMore?: () => Promise<void>
    /** 触发加载更多的距离阈值*/
    threshold?: number
}

function FixedVirtualList<T>({
    itemHeight = 50,
    renderItem,
    pageSize = 0,
    buffer = 0,
    data,
    loadMore,
    threshold = 0
}: FixedVirtualListProps<T>) {
    const [limit, setLimit] = useState(pageSize)
    const [loading, setLoading] = useState(false)
    const [startIndex, setStartIndex] = useState(0)

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)

    // 滚动条高度
    const scrollbarHeight = useMemo(() => data.length * itemHeight, [itemHeight, data])

    const endIndex = useMemo(() => {
        const start = Math.min(startIndex, data.length - limit)
        const end = Math.min(start + limit, data.length)
        return end
    }, [data, limit, startIndex])

    // 渲染范围
    const visibleData = useMemo(() => {
        return data.slice(startIndex, endIndex)
    }, [data, startIndex, endIndex])

    // 设置初始范围
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer || pageSize !== 0) return
        const itemCount = Math.ceil(scrollContainer.offsetHeight / itemHeight) + buffer
        setLimit(itemCount)
    }, [itemHeight, pageSize, buffer])

    const hanlerScroll = async () => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        const scrollTop = scrollContainer.scrollTop

        // 计算当前显示范围
        const start = Math.max(0, Math.floor(scrollTop / itemHeight))

        // 计算偏移量
        const offset = start * itemHeight

        setStartIndex(start)
        updateOffset(offset)

        // 触底加载
        if (!loading && loadMore && isScrollEnd(scrollContainer, threshold)) {
            setLoading(true)
            await loadMore()
            setLoading(false)
        }
    }

    // 更新偏移量
    const updateOffset = (offset: number) => {
        const contentContainer = contentContainerRef.current
        if (!contentContainer) return
        contentContainer.style.transform = `translateY(${offset}px)`
    }

    // 判断是否滚动到底部
    const isScrollEnd = (scrollContainer: HTMLDivElement, threshold: number) => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        const scrollBottom = Math.ceil(scrollTop + clientHeight)
        return scrollBottom >= scrollHeight - threshold
    }

    return (
        <ScrollArea
            className="h-full overflow-auto relative"
            onScroll={throttle(hanlerScroll, 150)}
            ref={scrollContainerRef}
        >
            <div className="absolute top-0 left-0 right-0" style={{ height: scrollbarHeight }} />
            <div ref={contentContainerRef}>
                {visibleData.map((item, index) => {
                    const realIndex = index + startIndex
                    return (
                        <div key={realIndex} style={{ height: itemHeight }}>
                            {renderItem(item, realIndex)}
                        </div>
                    )
                })}
                {loading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white flex justify-center items-center py-1.5 text-sm">
                        加载中...
                    </div>
                )}
            </div>
        </ScrollArea>
    )
}

export default FixedVirtualList
