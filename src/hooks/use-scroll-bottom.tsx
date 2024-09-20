import { RefObject, useEffect, useState } from 'react'

export function useScrollBottom(scrollRef: RefObject<HTMLDivElement>, detach: boolean = false) {
    const [autoScroll, setAutoScroll] = useState(true)

    const scrollDomToBottom = () => {
        const dom = scrollRef.current
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true)
                dom.scrollTo(0, dom.scrollHeight)
            })
        }
    }

    useEffect(() => {
        if (autoScroll && detach) {
            scrollDomToBottom()
        }
    })

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollDomToBottom
    }
}
