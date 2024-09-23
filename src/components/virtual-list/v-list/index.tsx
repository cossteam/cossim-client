import React, { useEffect, useRef, useState } from 'react'
import Virtual from './virtual'
import { Item, Slot } from './item'
import { VirtualProps } from './props'

const EVENT_TYPE = {
    ITEM: 'item_resize',
    SLOT: 'slot_resize'
}

const SLOT_TYPE = {
    HEADER: 'thead',
    FOOTER: 'tfoot'
}

const VirtualList: React.FC<VirtualProps> = (props) => {
    const {
        dataSources,
        keeps = 30,
        start = 0,
        offset = 0,
        direction,
        pageMode,
        itemClass,
        itemTag,
        itemStyle,
        headerClass,
        footerClass,
        wrapClass,
        wrapStyle,
        headerTag,
        footerTag,
        dataKey,
        dataComponent,
        itemScopedSlots,
        extraProps,
        estimateSize = 50
    } = props

    const [range, setRange] = useState<{ start: number; end: number } | null>(null)
    const virtualRef = useRef<Virtual | null>(null)
    const isHorizontal = direction === 'horizontal'
    const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop'
    const rootRef = useRef<HTMLDivElement | null>(null)
    const shepherdRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        installVirtual()
        return () => {
            virtualRef.current?.destroy()
        }
    }, [])

    useEffect(() => {
        virtualRef.current?.updateParam('uniqueIds', getUniqueIdFromDataSources())
        virtualRef.current?.handleDataSourcesChange()
    }, [dataSources.length])

    useEffect(() => {
        virtualRef.current?.updateParam('keeps', keeps)
        virtualRef.current?.handleSlotSizeChange()
    }, [keeps])

    useEffect(() => {
        scrollToIndex(start)
    }, [start])

    useEffect(() => {
        scrollToOffset(offset)
    }, [offset])

    useEffect(() => {
        if (pageMode) {
            document.addEventListener('scroll', onScroll, { passive: false })
            return () => {
                document.removeEventListener('scroll', onScroll)
            }
        }
    }, [pageMode])

    const installVirtual = () => {
        virtualRef.current = new Virtual(
            {
                slotHeaderSize: 0,
                keeps,
                estimateSize,
                buffer: Math.round(keeps / 3),
                uniqueIds: getUniqueIdFromDataSources()
            },
            null
        )
        setRange(virtualRef.current.getRange())
    }

    const getUniqueIdFromDataSources = () => {
        return dataSources.map((dataSource) =>
            typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
        )
    }

    const scrollToOffset = (offset: number) => {
        if (rootRef.current) {
            rootRef.current[directionKey] = offset
        }
    }

    const scrollToIndex = (index: number) => {
        if (index >= dataSources.length - 1) {
            scrollToBottom()
        } else {
            const offset = virtualRef.current?.getOffset(index) || 0
            scrollToOffset(offset)
        }
    }

    const scrollToBottom = () => {
        if (shepherdRef.current) {
            const offset = shepherdRef.current[isHorizontal ? 'offsetLeft' : 'offsetTop']
            scrollToOffset(offset)
            setTimeout(() => {
                if (getOffset() + getClientSize() + 1 < getScrollSize()) {
                    scrollToBottom()
                }
            }, 3)
        }
    }

    const getOffset = () => {
        return rootRef.current ? Math.ceil(rootRef.current[directionKey]) : 0
    }

    const getClientSize = () => {
        return rootRef.current ? Math.ceil(rootRef.current[isHorizontal ? 'clientWidth' : 'clientHeight']) : 0
    }

    const getScrollSize = () => {
        return rootRef.current ? Math.ceil(rootRef.current[isHorizontal ? 'scrollWidth' : 'scrollHeight']) : 0
    }

    const onScroll = (evt: Event) => {
        const offset = getOffset()
        const clientSize = getClientSize()
        const scrollSize = getScrollSize()

        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
            return
        }

        virtualRef.current?.handleScroll(offset)
        emitEvent(offset, clientSize, scrollSize, evt)
    }

    const emitEvent = (offset: number, clientSize: number, scrollSize: number, evt: Event) => {
        // Emit scroll event and other conditions
    }

    const getRenderSlots = () => {
        const slots = []
        if (range) {
            const { start, end } = range

            for (let index = start; index <= end; index++) {
                const dataSource = dataSources[index]
                if (dataSource) {
                    const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
                    if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
                        slots.push(
                            <Item
                                key={uniqueKey}
                                index={index}
                                tag={itemTag}
                                event={EVENT_TYPE.ITEM}
                                horizontal={isHorizontal}
                                uniqueKey={uniqueKey}
                                source={dataSource}
                                extraProps={extraProps}
                                component={dataComponent}
                                scopedSlots={itemScopedSlots}
                                className={itemClass}
                                style={itemStyle}
                            />
                        )
                    } else {
                        console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`)
                    }
                } else {
                    console.warn(`Cannot get the index '${index}' from data-sources.`)
                }
            }
        }
        return slots
    }

    return (
        // @ts-ignore
        <div ref={rootRef} onScroll={!pageMode && onScroll} className={wrapClass} style={wrapStyle}>
            <div
                role="group"
                style={
                    {
                        // padding: isHorizontal
                        //     ? `0px ${range?.padBehind}px 0px ${range?.padFront}px`
                        //     : `${range?.padFront}px 0px ${range?.padBehind}px`
                    }
                }
            >
                {getRenderSlots()}
            </div>

            <div
                ref={shepherdRef}
                style={{ width: isHorizontal ? '0px' : '100%', height: isHorizontal ? '100%' : '0px' }}
            />
        </div>
    )
}

export default VirtualList
