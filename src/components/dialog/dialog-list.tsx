import { formatDate } from '@/lib/utils'
import { generateChatList } from '@/mock/data'
import { useRef, useState } from 'react'
import ListItem from '@/components/common/list-item'
import { useConfigStore } from '@/stores/config'
import { DialogListItem } from '@/interface/model/dialog'
import { ScrollArea } from '@/ui/scroll-area'
import { Virtualizer } from 'virtua'

const DialogList = () => {
    const [data, setData] = useState<DialogListItem[]>(generateChatList(15))
    const ref = useRef<HTMLDivElement>(null)
    const isPrepend = useRef(false)

    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)

    const handleScroll = async () => {
        isPrepend.current = true
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        // setData((prev) => [...prev, ...generateChatList(15)])
        // isPrepend.current = false
    }

    return (
        <ScrollArea className="flex-1" ref={ref} style={{ width: sidebarWidth }}>
            <Virtualizer onScrollEnd={handleScroll} itemSize={72} scrollRef={ref}>
                {data.map((chat, index) => (
                    <ListItem
                        key={index}
                        src="https://picsum.photos/56"
                        name={chat?.dialog_name}
                        description={chat?.last_message?.content}
                        right={{
                            date: formatDate(chat?.last_message?.send_at),
                            unreadCount: chat?.dialog_unread_count
                        }}
                    />
                ))}
            </Virtualizer>
        </ScrollArea>
    )
}

export default DialogList
