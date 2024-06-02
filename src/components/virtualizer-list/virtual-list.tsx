// VirtualList.tsx
import React, { useRef, useState, useEffect } from 'react'
import Virtual from './virtual'
import './virtual-list.scss'

interface DataItem {
    id: number
    message: string
}

interface VirtualListProps<T = any> {
    data: T[]
    itemHeight?: number
    height: number
    children: (index: number) => React.ReactNode
}

const VirtualList: React.FC<VirtualListProps> = ({ data, itemHeight, height, children }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [visibleData, setVisibleData] = useState<DataItem[]>([])

    useEffect(() => {
        if (containerRef.current) {
            const virtual = new Virtual<DataItem>(containerRef.current, {
                height,
                itemHeight,
                data,
                renderItem: () => <>111</>
            })
            setVisibleData(virtual.visibleData)
        }
        // return () => {
        //     virtual.destroy()
        // }
    }, [containerRef, data, itemHeight, height, children])
    // = new Virtual<DataItem>(containerRef.current, {})

    return (
        <div ref={containerRef}>
            {visibleData.map((item, index) => {
                return (
                    <div key={item.id} className="virtual-item">
                        {children(index)}
                    </div>
                )
            })}
        </div>
    )
}

export default VirtualList
