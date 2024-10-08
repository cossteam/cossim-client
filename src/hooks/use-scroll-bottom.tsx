import { RefObject, useEffect, useState } from 'react'

export function useScrollBottom(scrollRef: RefObject<HTMLDivElement>, detach: boolean = false) {
    const [autoScroll, setAutoScroll] = useState(detach)

    const scrolToBottom = () => {
        const dom = scrollRef.current
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true)
                dom.scrollTo(0, dom.scrollHeight)
            })
        }
    }

    const scrollToRange = (top: number) => {
        const dom = scrollRef.current
        if (dom) {
            console.log('top', top)

            dom.scrollTop = top
        }
    }

    useEffect(() => {
        if (autoScroll) {
            scrolToBottom()
        }
    }, [autoScroll])

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrolToBottom,
        scrollToRange
    }
}
