import { useScrollBottom } from '@/hooks/use-scroll-bottom'
// import { debounce } from '@/lib/utils'
import { ScrollArea } from '@/ui/scroll-area'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Virtuoso, VirtuosoProps, VirtuosoHandle } from 'react-virtuoso'

interface VirtualizedListProps<T = any> extends Partial<VirtuosoProps<T, any>> {
    inverse?: boolean
    height?: number | string
    renderItem: (index: number, data: T) => JSX.Element
    loadMore?: () => void
}

const Scroller = forwardRef<HTMLDivElement, any>(({ style, ...props }, ref) => {
    // ScrollArea
    return <ScrollArea className="h-full overflow-auto" style={{ ...style }} ref={ref} {...props} />
})

const VirtualizedList: React.FC<VirtualizedListProps> = ({
    height,
    inverse = false,
    renderItem,
    increaseViewportBy = 200,
    loadMore,
    ...props
}) => {
    const virtuoso = useRef<VirtuosoHandle>(null)

    useEffect(() => {
        if (virtuoso.current && inverse) {
            virtuoso.current.scrollToIndex({
                index: 99,
                behavior: 'auto'
            })
        }
    }, [inverse])

    return (
        <Virtuoso
            ref={virtuoso}
            style={{ height }}
            itemContent={renderItem}
            components={{ Scroller }}
            increaseViewportBy={increaseViewportBy}
            endReached={!inverse ? loadMore : undefined}
            startReached={inverse ? loadMore : undefined}
            {...props}
        />
    )
}

const initialData = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `name${i}`,
    age: i % 10
}))

const Example: React.FC = () => {
    const [data, setData] = useState(initialData)

    const renderItem = useCallback(
        (index: number, item: any) => (
            <div className="flex items-center border" style={{ height: [50, 100, 150, 200][item.age % 4] }}>
                <div className="w-12">{item.id}</div>
            </div>
        ),
        []
    )

    const loadMore = useCallback(() => {
        console.log('load more')

        const newData = data.concat(
            Array.from({ length: 20 }, (_, i) => ({
                id: data.length + i,
                name: `name${data.length + i}`,
                age: (data.length + i) % 10
            }))
        )
        setData(newData)
    }, [data])

    return (
        <div className="h-96">
            <VirtualizedList data={data} renderItem={renderItem} loadMore={loadMore} inverse={true} />
        </div>
    )
}

export default Example
