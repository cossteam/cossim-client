import { ScrollArea } from '@/ui/scroll-area'
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { debounce } from 'es-toolkit/function'
import { useScrollBottom } from '@/hooks/use-scroll-bottom'

interface VirtualListProps<T = any> {
    /** 初始数据 */
    data: T[]
    /** 缓存元素数量 */
    cacheCount?: number
    /** 是否从底部开始 */
    startFromBottom?: boolean
    /** 元素渲染函数 */
    renderItem: (item: T) => React.ReactNode
    /** 距离底部距离 */
    threshold?: number
    /** 是否反向渲染 */
    inverse?: boolean
    /** 每个元素可能的高度 */
    maybeHeight?: number
}

const initialData = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `name${i}`,
    age: i % 10
}))

enum ScrollDirection {
    Up = 'up',
    Down = 'down'
}

const VirtualList: React.FC<VirtualListProps> = ({
    data = initialData,
    cacheCount = 5,
    startFromBottom = false,
    renderItem,
    threshold = 50,
    inverse = true,
    maybeHeight = 80
}) => {
    const pageSize = 15
    const [startIndex, setstartIndex] = useState(inverse ? data.length - pageSize : 0)
    const [translateY, setTranslateY] = useState(0)
    const [cacheHeights, setCacheHeights] = useState<{ [key: number]: number }>({})
    const [hiddenCount, setHiddenCount] = useState(0)

    const [isScrollTop, setIsScrollTop] = useState(inverse)
    const [isScrollBottom, setIsScrollBottom] = useState(!inverse)

    // refs
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const scrollBarRef = useRef<HTMLDivElement>(null)
    const contentContainerRef = useRef<HTMLDivElement>(null)
    const scrollHeightRefs = useRef<HTMLDivElement[]>([])

    const scrollHeight = useMemo(() => {
        // return Object.values(cacheHeights).reduce((acc, cur) => acc + cur, 0)
        const mayHeight = maybeHeight * data.length
        const length = Object.values(cacheHeights).length
        const nowHeight = Object.values(cacheHeights).reduce((acc, cur) => acc + cur, 0)
        const height = mayHeight - length * maybeHeight + nowHeight
        return height
    }, [cacheHeights, startIndex, maybeHeight])

    const renderData = useMemo(() => {
        console.log('start', startIndex)
        const endIndex = inverse ? Math.min(startIndex + pageSize, data.length) : Math.max(startIndex - pageSize, 0)
        return data.slice(startIndex, endIndex)
    }, [startIndex])

    const styleTransform = useMemo(() => {
        return {
            transform: `translateY(${translateY}px)`
        }
    }, [translateY])

    let lastScrollTop = 0
    const onScroll = () => {
        const el = scrollContainerRef.current
        if (!el) return

        const scrollTop = el.scrollTop
        const scrollHeight = el.scrollHeight
        const clientHeight = el.clientHeight

        if (lastScrollTop === 0 && inverse) lastScrollTop = scrollTop
        const direction = scrollTop > lastScrollTop ? ScrollDirection.Down : ScrollDirection.Up

        if (direction === ScrollDirection.Down && scrollTop + clientHeight >= scrollHeight - threshold) {
            console.log('Bottom')
            loadMore(direction)
        }

        if (direction === ScrollDirection.Up && scrollTop <= threshold) {
            console.log('Top')
            loadMore(direction)
        }

        lastScrollTop = scrollTop

        // setTranslateY(scrollTop)
        // console.log(Object.values(cacheHeights).slice(-hiddenCount))
        const heights = Object.values(cacheHeights)
            .slice(-hiddenCount)
            .reduce((acc, cur) => acc + cur, 0)
        setTranslateY(scrollTop + heights)
    }

    const loadMore = (direction: ScrollDirection) => {
        const next = startIndex - hiddenCount - cacheCount
        const prev = startIndex + hiddenCount + cacheCount

        if (direction === ScrollDirection.Down) {
            setstartIndex(inverse ? prev : next)
        }

        if (direction === ScrollDirection.Up) {
            setstartIndex(inverse ? next : prev)
        }
    }

    useEffect(() => {
        if (scrollHeightRefs.current.length === 0) return
        scrollHeightRefs.current.map((el) => {
            const height = el.offsetHeight
            const dataIndex = parseInt(el.getAttribute('data-index') || '0')
            // 如果缓存的高度和元素实际高度一致，就不再重新计算
            if (cacheHeights[dataIndex] && cacheHeights[dataIndex] === height) return
            // 缓存元素高度
            setCacheHeights((prev) => {
                return {
                    ...prev,
                    [dataIndex]: height
                }
            })
        })
    }, [startIndex])

    useEffect(() => {
        if (scrollHeightRefs.current.length === 0) return
        const observer = new IntersectionObserver((entries) => {
            setHiddenCount(0)
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    setHiddenCount((prev) => prev + 1)
                }
            })
        })

        scrollHeightRefs.current.forEach((el) => {
            observer.observe(el)
        })

        return () => {
            observer.disconnect()
        }
    })

    useScrollBottom(scrollContainerRef, inverse)

    return (
        <div className="h-full w-full overflow-auto relative" ref={scrollContainerRef} onScroll={onScroll}>
            <div className="absolute top-0 right-0 left-0" style={{ height: `${scrollHeight}px` }} ref={scrollBarRef} />
            <div className="absolute top-0 left-0 w-full h-full" style={styleTransform} ref={contentContainerRef}>
                {renderData.map((item, index) => {
                    return (
                        <div
                            className="border"
                            key={index}
                            ref={(el) => {
                                if (el) {
                                    scrollHeightRefs.current[index] = el
                                }
                            }}
                            data-index={startIndex + index}
                            style={{ height: [50, 100, 150, 200][item.age % 4] }}
                        >
                            {renderItem(item)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const Example: React.FC = () => {
    const renderItem = (item: any) => (
        <div className="flex items-center" style={{ height: [50, 100, 150, 200][item.age % 4] }}>
            <div className="w-12">{item.id}</div>
        </div>
    )
    return (
        <div className="h-96">
            <VirtualList data={initialData} cacheCount={5} startFromBottom={true} renderItem={renderItem} />
        </div>
    )
}

export default Example
