import React, { useEffect, useRef, useState, useCallback } from 'react'
import Virtual from './virtual'
import Item from './item'

interface Range {
    start: number
    end: number
    padFront: number
    padBehind: number
}

interface DataSource {
    [key: string]: any
}

interface VirtualListProps {
    data: DataSource[]
    dataKey: string | ((dataSource: DataSource) => string | number)
    item: React.ComponentType<any>
    keeps?: number
    size?: number
    start?: number
    offset?: number
    topThreshold?: number
    bottomThreshold?: number
    itemProps?: object
    dataPropName?: string
    onScroll?: (offset: number, clientSize: number, scrollSize: number) => void
    onToTop?: () => void
    onToBottom?: () => void
    onResized?: (id: string, size: number) => void
}

const VirtualList: React.FC<VirtualListProps> = ({
    data = [],
    dataKey,
    item: ItemComponent,
    keeps = 30,
    size = 50,
    start = 0,
    offset = 0,
    topThreshold = 0,
    bottomThreshold = 0,
    itemProps = {},
    dataPropName = 'source',
    onScroll,
    onToTop,
    onToBottom,
    onResized
}) => {
    const [range, setRange] = useState<Range | null>(null)
    const rootRef = useRef<HTMLDivElement | null>(null)
    const shepherdRef = useRef<HTMLDivElement | null>(null)
    const virtualRef = useRef<Virtual | null>(null)

    useEffect(() => {
        const virtual = new Virtual(
            {
                slotHeaderSize: 0,
                slotFooterSize: 0,
                keeps,
                estimateSize: size,
                buffer: Math.round(keeps / 3),
                uniqueIds: getUniqueIdFromDataSources()
            },
            onRangeChanged
        )

        virtualRef.current = virtual
        setRange(virtual.getRange())

        if (start) {
            scrollToIndex(start)
        } else if (offset) {
            scrollToOffset(offset)
        }

        return () => {
            virtual.destroy()
        }
    }, [data, keeps, size, start, offset])

    const getUniqueIdFromDataSources = useCallback(() => {
        return data.map((dataSource: DataSource) =>
            typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
        )
    }, [data, dataKey])

    const scrollToIndex = useCallback(
        (index: number, smooth?: boolean, topDistance = 0) => {
            const virtual = virtualRef.current
            if (!virtual) return

            if (index >= data.length - 1) {
                scrollToBottom()
            } else {
                const offset = virtual.getOffset(index) - topDistance
                scrollToOffset(offset, smooth)
            }
        },
        [data.length]
    )

    const scrollToOffset = useCallback((offset: number, smooth = false) => {
        if (rootRef.current) {
            rootRef.current.scrollTo({
                left: 0,
                top: offset,
                behavior: smooth ? 'smooth' : 'auto'
            })
        }
    }, [])

    const scrollToBottom = useCallback(
        (smooth = false) => {
            if (shepherdRef.current) {
                const offset = shepherdRef.current.offsetTop
                scrollToOffset(offset, smooth)
            }
        },
        [scrollToOffset]
    )

    const getSizes = useCallback(() => {
        return virtualRef.current?.sizes.size || 0
    }, [])

    const onRangeChanged = useCallback((newRange: Range) => {
        setRange(newRange)
    }, [])

    const onItemResized = useCallback(
        (id: string, size: number) => {
            virtualRef.current?.saveSize(id, size)
            onResized && onResized(id, size)
        },
        [onResized]
    )

    const handleScroll = useCallback(() => {
        const virtual = virtualRef.current
        const root = rootRef.current
        if (!root || !virtual) return

        const offset = root.scrollTop
        const clientSize = root.clientHeight
        const scrollSize = root.scrollHeight

        virtual.handleScroll(offset)
        if (onScroll) onScroll(offset, clientSize, scrollSize)

        if (virtual.isFront() && offset - topThreshold <= 0) {
            onToTop && onToTop()
        } else if (virtual.isBehind() && offset + clientSize + bottomThreshold >= scrollSize) {
            onToBottom && onToBottom()
        }
    }, [onScroll, onToTop, onToBottom, topThreshold, bottomThreshold])

    const getRenderSlots = useCallback(() => {
        const slots: JSX.Element[] = []
        const { start, end } = range || { start: 0, end: 0 }

        for (let index = start; index <= end; index++) {
            const dataSource = data[index]
            const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]

            if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
                slots.push(
                    <Item
                        key={uniqueKey}
                        index={index}
                        uniqueKey={uniqueKey}
                        source={dataSource}
                        component={ItemComponent}
                        itemProps={itemProps}
                        dataPropName={dataPropName}
                        onItemResize={onItemResized}
                    />
                )
            }
        }
        return slots
    }, [range, data, dataKey, ItemComponent, itemProps, dataPropName, onItemResized])

    return (
        <div ref={rootRef} onScroll={handleScroll}>
            <div style={{ padding: `${range?.padFront || 0}px 0 ${range?.padBehind || 0}px` }}>{getRenderSlots()}</div>
            <div ref={shepherdRef} style={{ width: '100%', height: '0' }} />
        </div>
    )
}

export default VirtualList
