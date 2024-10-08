import { generateMessageList } from '@/mock/data'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VList, VListHandle } from '@/components/virtual-list/index'
import ChatContent from './chat-content'

function ChatBody() {
    const [items, setItems] = useState(generateMessageList(20))
    const ref = useRef<VListHandle>(null)
    const isPrepend = useRef(false)
    const shouldStickToBottom = useRef(true)

    useLayoutEffect(() => {
        isPrepend.current = false
    })

    useEffect(() => {
        if (!ref.current) return
        if (!shouldStickToBottom.current) return
        ref.current.scrollToIndex(items.length - 1, {
            align: 'end'
        })
    }, [items.length])

    useEffect(() => {
        let canceled = false
        let timer: ReturnType<typeof setTimeout> | null = null
        const setTimer = () => {
            timer = setTimeout(() => {
                if (canceled) return
                setItems((p) => [...p, ...generateMessageList(20)])
                setTimer()
            }, 5000)
        }
        setTimer()
        return () => {
            canceled = true
            if (timer) clearTimeout(timer)
        }
    }, [])

    const handleScroll = (offset: number) => {
        if (!ref.current) return
        shouldStickToBottom.current =
            offset - ref.current.scrollSize + ref.current.viewportSize >=
            // 修复：当浏览器的 window.devicePixelRatio 具有十进制值时，由于子像素值，总和可能不为 0
            -1.5
        if (offset < 100) {
            isPrepend.current = true
            setItems((p) => [...generateMessageList(20), ...p])
        }
    }

    return (
        <VList
            ref={ref}
            style={{
                flex: 1
            }}
            reverse
            shift={isPrepend.current}
            onScroll={handleScroll}
        >
            {items.map((item, index) => (
                <ChatContent key={index} item={item} aligin={index % 2 === 0 ? 'left' : 'right'} />
            ))}
        </VList>
    )
}

export default ChatBody
