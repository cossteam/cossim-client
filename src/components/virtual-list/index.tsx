import { ReactElement, forwardRef, useRef } from 'react'
import { Virtualizer, VirtualizerHandle, VirtualizerProps, type ViewportComponentAttributes } from 'virtua'
import { ScrollArea } from '@/ui/scroll-area'

/**
 * Methods of {@link VList}.
 */
export interface VListHandle extends VirtualizerHandle {}

/**
 * Props of {@link VList}.
 */
export interface VListProps
    extends Pick<
            VirtualizerProps,
            | 'children'
            | 'count'
            | 'overscan'
            | 'itemSize'
            | 'shift'
            | 'horizontal'
            | 'cache'
            | 'ssrCount'
            | 'item'
            | 'onScroll'
            | 'onScrollEnd'
            | 'onRangeChange'
            | 'keepMounted'
        >,
        ViewportComponentAttributes {
    /**
     * If true, items are aligned to the end of the list when total size of items are smaller than viewport size. It's useful for chat like app.
     */
    reverse?: boolean
}

/**
 * Virtualized list component. See {@link VListProps} and {@link VListHandle}.
 */
export const VList = forwardRef<VListHandle, VListProps>(
    (
        {
            children,
            count,
            overscan,
            keepMounted,
            itemSize,
            shift,
            horizontal,
            reverse,
            cache,
            ssrCount,
            item,
            onScroll,
            onScrollEnd,
            onRangeChange,
            style,
            ...attrs
        },
        ref
    ): ReactElement => {
        const scrollRef = useRef<HTMLDivElement>(null)
        const shouldReverse = reverse && !horizontal

        let element = (
            <Virtualizer
                ref={ref}
                scrollRef={shouldReverse ? scrollRef : undefined}
                count={count}
                overscan={overscan}
                keepMounted={keepMounted}
                itemSize={itemSize}
                shift={shift}
                horizontal={horizontal}
                cache={cache}
                ssrCount={ssrCount}
                item={item}
                onScroll={onScroll}
                onScrollEnd={onScrollEnd}
                onRangeChange={onRangeChange}
                {...attrs}
            >
                {children}
            </Virtualizer>
        )

        if (shouldReverse) {
            element = (
                <div
                    style={{
                        visibility: 'hidden', // TODO 替换为其他优化方法
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        minHeight: '100%'
                    }}
                >
                    {element}
                </div>
            )
        }

        return (
            <ScrollArea
                ref={scrollRef}
                {...attrs}
                style={{
                    display: horizontal ? 'inline-block' : 'block',
                    [horizontal ? 'overflowX' : 'overflowY']: 'auto',
                    contain: 'strict',
                    width: '100%',
                    height: '100%',
                    ...style
                }}
            >
                {element}
            </ScrollArea>
        )
    }
)
