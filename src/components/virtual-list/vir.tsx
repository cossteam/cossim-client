import React, { useEffect, useRef, useState, useMemo } from 'react'
import { debounce } from 'es-toolkit/function'

// Content item and its position in the DOM
interface ContentType {
    id: number
    title: string
    content: string
    arrPos: number
}

interface ContentPosition {
    arrPos: number
    startPos: number
    endPos: number
    height: number
}

// Constants for initial heights
const maybeHeight = 100

const DynItemHeightVersion09: React.FC<{ cacheCount?: number }> = ({ cacheCount = 5 }) => {
    const [allData, setAllData] = useState<ContentType[]>([])
    const [positionDataArr, setPositionDataArr] = useState<ContentPosition[]>([])
    const [pillarDomHeight, setPillarDomHeight] = useState(0)
    const [start, setStart] = useState(0)
    const [contentListOffset, setContentListOffset] = useState(0)
    const [hasMoreData, setHasMoreData] = useState(true)
    const [dataLoading, setDataLoading] = useState(false)

    const scrollerContainerRef = useRef<HTMLDivElement>(null)
    const contentListRef = useRef<HTMLDivElement>(null)

    // Mock data generator
    const loadData = async (count = 100): Promise<ContentType[]> => {
        const totalCount = allData.length
        if (totalCount >= 500) return []

        return Array.from({ length: count }, (_, idx) => ({
            id: totalCount + idx,
            title: `Title ${idx}`,
            content: `Content ${idx}`,
            arrPos: totalCount + idx
        }))
    }

    // Initializing data
    const init = async () => {
        const newData = await loadData()
        setAllData(newData)
        const newPositionData = newData.map((_, idx) => ({
            arrPos: idx,
            startPos: maybeHeight * idx,
            endPos: maybeHeight * idx + maybeHeight,
            height: maybeHeight
        }))
        setPositionDataArr(newPositionData)
    }

    useEffect(() => {
        init()
    }, [])

    // Update positions and heights
    const updateHeightAndPos = () => {
        const contentListDom = contentListRef.current
        if (!contentListDom) return

        const childrenElements = Array.from(contentListDom.children) as HTMLElement[]

        childrenElements.forEach((child) => {
            const dataIndex = parseInt(child.dataset.index || '0', 10)
            const dataItem = positionDataArr[dataIndex]
            if (!dataItem) return

            const height = child.offsetHeight
            const diff = dataItem.height - height

            if (diff !== 0) {
                dataItem.height -= diff
                dataItem.endPos -= diff

                for (let j = dataIndex + 1; j < positionDataArr.length; j++) {
                    const nextItem = positionDataArr[j]
                    const prevItem = positionDataArr[j - 1]

                    nextItem.startPos = prevItem.endPos
                    nextItem.endPos = nextItem.startPos + nextItem.height
                }

                setPositionDataArr([...positionDataArr])
            }
        })

        const lastPosition = positionDataArr[positionDataArr.length - 1]
        setPillarDomHeight(lastPosition ? lastPosition.endPos : 0)
    }

    useEffect(() => {
        updateHeightAndPos()
    }, [])

    // Scroll event handler
    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scroller = e.target as HTMLDivElement
        const scrollTop = scroller.scrollTop
        const scrollHeight = scroller.scrollHeight
        const clientHeight = scroller.clientHeight

        const newStart = findStartByBinarySearch(positionDataArr, scrollTop)
        setStart(newStart)

        const realStart = Math.max(0, newStart - cacheCount)
        setContentListOffset(positionDataArr[realStart]?.startPos || 0)

        // Load more data if near the bottom
        if (scrollHeight - clientHeight - scrollTop < 1000 && !dataLoading && hasMoreData) {
            appendData()
        }
    }

    // Find new start index using binary search
    const findStartByBinarySearch = (arr: ContentPosition[], scrollPos: number) => {
        let low = 0
        let high = arr.length - 1

        while (low <= high) {
            const mid = Math.floor((low + high) / 2)
            if (arr[mid].endPos < scrollPos) {
                low = mid + 1
            } else {
                high = mid - 1
            }
        }

        return low
    }

    const appendData = async () => {
        setDataLoading(true)
        const newData = await loadData()
        if (newData.length === 0) {
            setHasMoreData(false)
        } else {
            const newStartPos = positionDataArr[positionDataArr.length - 1]?.endPos || 0
            const newPositions = newData.map((_, idx) => ({
                arrPos: allData.length + idx,
                startPos: newStartPos + maybeHeight * idx,
                endPos: newStartPos + maybeHeight * (idx + 1),
                height: maybeHeight
            }))

            setAllData([...allData, ...newData])
            setPositionDataArr([...positionDataArr, ...newPositions])
        }

        setDataLoading(false)
    }

    // Render data
    const renderData = useMemo(() => {
        const realStart = Math.max(0, start - cacheCount)
        const realEnd = Math.min(start + cacheCount + 10, allData.length)
        return allData.slice(realStart, realEnd)
    }, [start, cacheCount, allData])

    return (
        <div
            ref={scrollerContainerRef}
            onScroll={debounce(onScroll, 100)}
            className="h-96 overflow-y-auto border border-gray-300"
        >
            <div className="relative" style={{ height: `${pillarDomHeight}px` }}>
                <div ref={contentListRef} style={{ transform: `translateY(${contentListOffset}px)` }}>
                    {renderData.map((item) => (
                        <div
                            key={item.id}
                            data-index={item.arrPos}
                            className="border"
                            style={{
                                height: [80, 160, 240, 320, 400][Math.floor(Math.random() * 5)]
                            }}
                        >
                            <h2 className="text-lg font-bold">{item.title}</h2>
                            <p>{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DynItemHeightVersion09
