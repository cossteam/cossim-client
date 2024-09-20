import { useScrollBottom } from '@/hooks/use-scroll-bottom'
// import { debounce } from '@/lib/utils'
import { ScrollArea } from '@/ui/scroll-area'
import { useMemo, useRef, useState } from 'react'

interface VirtualizedListProps<T> {
    data: T[]
    inverse?: boolean
    pageSize?: number
    height?: number | string
    renderItem: (item: T, index: number) => JSX.Element
}

function VirtualizedList<T>({ data, pageSize = 15, inverse = false, renderItem }: VirtualizedListProps<T>) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const dataLength = useMemo(() => data.length, [data])
    const startIndex = useMemo(() => {
        return inverse ? Math.max(0, dataLength - pageSize) : 0
    }, [dataLength, inverse])

    // 渲染索引
    const [hitBottom, setHitBottom] = useState(true)

    const [renderIndex, _setRenderIndex] = useState(startIndex)
    const setRenderIndex = (index: number) => {
        index = Math.min(dataLength - pageSize, index)
        index = Math.max(0, index)
        _setRenderIndex(index)
    }

    // 判断是否滚动到底部
    const isScrolledToBottom = useMemo(() => {
        const el = scrollContainerRef.current
        if (el && inverse) {
            return Math.abs(el.scrollHeight - (el.scrollTop + el.clientHeight)) <= 1
        }
        return inverse
    }, [scrollContainerRef, inverse])
    const { setAutoScroll } = useScrollBottom(scrollContainerRef, isScrolledToBottom)

    const isMobileScreen = window.innerWidth <= 768
    const onChatBodyScroll = (e: HTMLElement) => {
        const bottomHeight = e.scrollTop + e.clientHeight
        const edgeThreshold = e.clientHeight

        const isTouchTopEdge = e.scrollTop <= edgeThreshold
        const isTouchBottomEdge = bottomHeight >= e.scrollHeight - edgeThreshold
        const isHitBottom = bottomHeight >= e.scrollHeight - (isMobileScreen ? 4 : 10)

        const prevPageMsgIndex = renderIndex - pageSize
        const nextPageMsgIndex = renderIndex + pageSize

        if (isTouchTopEdge && !isTouchBottomEdge) {
            setRenderIndex(prevPageMsgIndex)
        } else if (isTouchBottomEdge) {
            setRenderIndex(nextPageMsgIndex)
        }

        setHitBottom(isHitBottom)
        setAutoScroll(isHitBottom)
    }

    const visibleData = useMemo(() => {
        const endRenderIndex = Math.min(renderIndex + 3 * pageSize, dataLength)
        return data.slice(renderIndex, endRenderIndex)
    }, [renderIndex, data, dataLength])

    return (
        <ScrollArea
            ref={scrollContainerRef}
            className="h-full overscroll-none relative"
            viewportScroll={onChatBodyScroll}
            onTouchStart={() => {
                setAutoScroll(false)
            }}
        >
            {visibleData.map((item, index) => {
                return (
                    <div className="w-full relative" key={index}>
                        {renderItem(item, renderIndex)}
                    </div>
                )
            })}
        </ScrollArea>
    )
}

export default VirtualizedList
