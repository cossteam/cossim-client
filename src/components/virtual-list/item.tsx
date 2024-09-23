import React, { useEffect, useRef, useCallback } from 'react'

interface VirtualListItemProps {
    index: number
    source: any
    component: React.ElementType
    uniqueKey: string | number
    itemProps?: Record<string, any>
    dataPropName?: string
    onItemResize?: (key: string | number, size: number) => void
}

const VirtualListItem: React.FC<VirtualListItemProps> = ({
    index,
    source,
    component: Comp,
    uniqueKey,
    itemProps = {},
    dataPropName = 'source',
    onItemResize
}) => {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const resizeObserver = useRef<ResizeObserver | null>(null)

    // Handle size change
    const dispatchSizeChange = useCallback(() => {
        if (onItemResize && rootRef.current) {
            const size = rootRef.current.offsetHeight
            onItemResize(uniqueKey, size)
        }
    }, [uniqueKey, onItemResize])

    useEffect(() => {
        if (typeof ResizeObserver !== 'undefined') {
            // Create a new ResizeObserver instance
            resizeObserver.current = new ResizeObserver(() => {
                dispatchSizeChange()
            })

            if (rootRef.current) {
                resizeObserver.current.observe(rootRef.current)
            }
        }

        return () => {
            // Clean up the ResizeObserver on unmount
            if (resizeObserver.current) {
                resizeObserver.current.disconnect()
                resizeObserver.current = null
            }
        }
    }, [dispatchSizeChange])

    useEffect(() => {
        // Trigger size change on update
        dispatchSizeChange()
    })

    // Merge itemProps and dataPropName into the component's props
    const mergedProps = {
        ...itemProps,
        index,
        [dataPropName]: source
    }

    return (
        <div key={uniqueKey} ref={rootRef}>
            {/* Render the custom component */}
            <Comp {...mergedProps} />
        </div>
    )
}

export default VirtualListItem
