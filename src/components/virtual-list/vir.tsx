import { useEffect, useMemo, useRef, useState } from 'react'

export enum ScrollDirection {
    Up = 'up',
    Down = 'down'
}

export interface VirtualListProps<T = any> {
    itemSize?: number
    inverse?: boolean
    data: T[]
    pageSize?: number
    cacheCount?: number
    threshold?: number
    estimatedHeight?: number
}

const initData = Array.from({ length: 100 }, (_, index) => index)

const VirtualList: React.FC<VirtualListProps> = ({
    data = initData,
    inverse = false,
    pageSize = 15,
    threshold = 50,
    cacheCount = 5,
    estimatedHeight = 80
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const scrollHeightRefs = useRef<HTMLDivElement[]>([])

    const [offset, setOffset] = useState<number>(0)
    const [sizes, setSizes] = useState<Record<number, number>>(
        data.reduce((acc, _cur, index) => ({ ...acc, [index]: estimatedHeight }), {})
    )
    const [point, setPoint] = useState<number[]>([
        inverse ? data.length - pageSize : 0,
        inverse ? data.length - 1 : pageSize
    ])

    const scrollHeight = useMemo(() => {
        return Object.values(sizes).reduce((acc, cur) => acc + cur, 0)
    }, [sizes])

    const viewportData = useMemo(() => {
        return data.slice(point[0], point[1])
    }, [point, data])

    const styleTransform = useMemo(() => {
        return {
            transform: `translateY(${offset}px)`
        }
    }, [offset])

    let lastScrollTop = 0
    const handleScroll = () => {
        const container = scrollContainerRef.current
        if (!container) return

        const scrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight

        let prevIndex = point[0]
        let nextIndex = point[1]

        if (lastScrollTop === 0 && inverse) lastScrollTop = scrollTop
        const direction = scrollTop > lastScrollTop ? ScrollDirection.Down : ScrollDirection.Up

        // && scrollTop + clientHeight >= scrollHeight - threshold
        if (direction === ScrollDirection.Down) {
            prevIndex = Math.min(point[0] + cacheCount, data.length - pageSize)
            nextIndex = Math.min(point[1] + cacheCount, data.length)
        }

        if (direction === ScrollDirection.Up) {
            prevIndex = Math.max(point[0] - cacheCount, 0)
            nextIndex = Math.min(point[1] - cacheCount, data.length)
        }

        // console.log('sizes', sizes)
        setPoint([prevIndex, nextIndex])
        // 修正 offset
        // const newOffset = Object.values(sizes)
        //     .slice(0, prevIndex)
        //     .reduce((acc, cur) => acc + cur, 0)
        // setOffset(newOffset)

        lastScrollTop = scrollTop
    }

    const [allData, setAllData] = useState<VitrualItem<any>[]>([])
    useEffect(() => {
        const all = data.map<VitrualItem<ContentType>>((item, idx) => ({
            data: item,
            arrPos: idx,
            startPos: estimatedHeight * idx,
            endPos: estimatedHeight * idx + estimatedHeight,
            height: estimatedHeight
        }))
    }, [data])

    // 缓存元素高度
    useEffect(() => {
        if (scrollHeightRefs.current.length === 0) return
        scrollHeightRefs.current.forEach((el) => {
            const height = el.offsetHeight
            const dataIndex = parseInt(el.getAttribute('data-index') || '0')
            if (sizes[dataIndex] && sizes[dataIndex] === height) return
            setSizes((prev) => ({
                ...prev,
                [dataIndex]: height
            }))
        })
    }, [point])

    return (
        <div className="h-96">
            <div className="h-full w-full overflow-auto relative" ref={scrollContainerRef} onScroll={handleScroll}>
                <div className="absolute top-0 right-0 left-0" style={{ height: scrollHeight }} />
                <div className="absolute top-0 left-0 w-full h-full" style={styleTransform}>
                    {viewportData.map((item, index) => (
                        <div
                            key={index}
                            className="p-2 border"
                            data-index={point[0] + index}
                            style={{ height: [50, 60, 70, 80, 90, 100, 150, 200][(Math.random() * 8) | 0] }}
                            ref={(el) => {
                                if (el) {
                                    scrollHeightRefs.current[point[0] + index] = el
                                }
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VirtualList
