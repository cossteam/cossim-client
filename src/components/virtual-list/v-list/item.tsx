import React, { useEffect, useRef } from 'react'
import { ItemProps, SlotProps } from './props'

const useResizeObserver = (callback: () => void) => {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (ref.current && typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(callback)
            resizeObserver.observe(ref.current)

            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [callback])

    return ref
}

// Item component
export const Item: React.FC<ItemProps> = ({
    component: Component,
    extraProps = {},
    index,
    source,
    uniqueKey,
    slotComponent,
    event,
    horizontal,
    className,
    style
}) => {
    const shapeKey = horizontal ? 'offsetWidth' : 'offsetHeight'
    const ref = useResizeObserver(() => {
        dispatchSizeChange()
    })

    const dispatchSizeChange = () => {
        if (ref.current) {
            const size = ref.current[shapeKey]
            // 这里可以调用父组件的事件
            console.log(event, uniqueKey, size) // 替换为实际的事件处理逻辑
        }
    }

    const props = {
        ...extraProps,
        source,
        index
    }

    return (
        <div key={uniqueKey} role="listitem" ref={ref} className={className} style={style}>
            {slotComponent ? slotComponent({ item: source, index, scope: props }) : <Component {...props} />}
        </div>
    )
}

// Slot component
export const Slot: React.FC<SlotProps> = ({ uniqueKey, children }) => {
    return (
        <div key={uniqueKey} role={String(uniqueKey)}>
            {children}
        </div>
    )
}
