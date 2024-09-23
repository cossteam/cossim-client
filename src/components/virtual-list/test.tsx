import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import Virtual from './virtual'
// import Item from './item'

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
    dataKey: string | ((item: DataSource) => string | number)
    item: React.ComponentType<any>
    keeps?: number
    size?: number
    start?: number
    offset?: number
    topThreshold?: number
    bottomThreshold?: number
    itemProps?: Record<string, any>
    dataPropName?: string
    onScroll?: (info: { offset: number; clientSize: number; scrollSize: number }) => void
    onTop?: () => void
    onBottom?: () => void
    onResized?: (id: string, size: number) => void
}

const VirtualList = forwardRef((props: VirtualListProps, ref) => {
    const {
        data,
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
        onTop,
        onBottom,
        onResized
    } = props

    const [range, setRange] = useState<Range | null>(null)
    const rootRef = useRef<HTMLDivElement | null>(null)
    const shepherdRef = useRef<HTMLDivElement | null>(null)
    const virtualRef = useRef<Virtual | null>(null)

    useEffect(() => {
        if (virtualRef.current) {
            virtualRef.current.updateParam('uniqueIds', getUniqueIdFromDataSources())
            virtualRef.current.handleDataSourcesChange()
        }
    }, [data.length])

    useEffect(() => {
        if (virtualRef.current) {
            virtualRef.current.updateParam('keeps', keeps)
            virtualRef.current.handleSlotSizeChange()
        }
    }, [keeps])

    useEffect(() => {
        scrollToIndex(start)
    }, [start])

    useEffect(() => {
        scrollToOffset(offset)
    }, [offset])

    const getSize = (id: string) => {
        return virtualRef.current?.sizes.get(id)
    }

    const getOffset = () => {
        return rootRef.current ? Math.ceil(rootRef.current.scrollTop) : 0
    }

    const getClientSize = () => {
        return rootRef.current ? Math.ceil(rootRef.current.clientHeight) : 0
    }

    const getScrollSize = () => {
        return rootRef.current ? Math.ceil(rootRef.current.scrollHeight) : 0
    }

    const emitEvent = (offset: number, clientSize: number, scrollSize: number) => {
        onScroll?.({ offset, clientSize, scrollSize })

        if (virtualRef.current?.isFront() && data.length && offset - topThreshold <= 0) {
            onTop?.()
        } else if (virtualRef.current?.isBehind() && offset + clientSize + bottomThreshold >= scrollSize) {
            onBottom?.()
        }
    }

    const handleScroll = () => {
        const offset = getOffset()
        const clientSize = getClientSize()
        const scrollSize = getScrollSize()
        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) return

        virtualRef.current?.handleScroll(offset)
        emitEvent(offset, clientSize, scrollSize)
    }

    const getUniqueIdFromDataSources = () => {
        return data.map((dataSource) => (typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]))
    }

    const onRangeChanged = (newRange: Range) => {
        setRange(newRange)
    }

    const installVirtual = () => {
        virtualRef.current = new Virtual(
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

        setRange(virtualRef.current.getRange())
    }

    const scrollToIndex = (index: number, smooth = false, topDistance = 0) => {
        if (index >= data.length - 1) {
            scrollToBottom(smooth)
        } else {
            const offset = virtualRef.current?.getOffset(index) - topDistance
            scrollToOffset(offset, smooth)
        }
    }

    const scrollToOffset = (offset: number, smooth = false) => {
        if (rootRef.current) {
            rootRef.current.scrollTo({
                top: offset,
                behavior: smooth ? 'smooth' : 'auto'
            })
        }
    }

    const getRenderSlots = () => {
        const slots = []
        if (range) {
            const { start, end } = range
            for (let index = start; index <= end; index++) {
                const dataSource = data[index]
                if (dataSource) {
                    const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
                    if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
                        slots.push(
                            <ItemComponent
                                key={uniqueKey}
                                index={index}
                                uniqueKey={uniqueKey}
                                {...{ [dataPropName]: dataSource }}
                                {...itemProps}
                                onItemResize={onItemResized}
                            />
                        )
                    }
                }
            }
        }
        return slots
    }

    const onItemResized = (id: string, size: number) => {
        virtualRef.current?.saveSize(id, size)
        onResized?.(id, size)
    }

    const scrollToBottom = (smooth = false) => {
        if (shepherdRef.current) {
            const offset = shepherdRef.current.offsetTop
            scrollToOffset(offset, smooth)
            setTimeout(() => {
                if (getOffset() + getClientSize() < getScrollSize()) {
                    scrollToBottom(smooth)
                }
            }, 3)
        }
    }

    const getSizes = () => {
        return virtualRef.current?.sizes.size
    }

    useImperativeHandle(ref, () => ({
        scrollToBottom,
        getSizes,
        getSize,
        getOffset,
        getScrollSize,
        getClientSize,
        scrollToOffset,
        scrollToIndex
    }))

    useEffect(() => {
        installVirtual()
    }, [])

    return (
        <div ref={rootRef} onScroll={handleScroll}>
            <div style={{ padding: `${range?.padFront}px 0px ${range?.padBehind}px` }}>{getRenderSlots()}</div>
            <div ref={shepherdRef} style={{ width: '100%', height: '0px' }} />
        </div>
    )
})

export default VirtualList
