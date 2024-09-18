import { formatDate } from '@/lib/utils'
import { generateChatList } from '@/mock/data'
import { ScrollArea } from '@/ui/scroll-area'
import { useMemo } from 'react'
import ListItem from '@/components/common/list-item'
import { useConfigStore } from '@/stores/config'

// TODO: add skeleton loading
const DialogListSkeleton = () => {
    return <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md"></div>
}

// TODO: add empty state
const DialogListEmpty = () => {
    return (
        <div className="w-full h-40 flex justify-center items-center">
            <p className="text-gray-700">暂无聊天记录</p>
        </div>
    )
}

const DialogList = () => {
    const chats = useMemo(() => generateChatList(15), [])
    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)
    // TODO: 添加虚拟滚动
    return (
        <ScrollArea className="flex-1">
            <div style={{ width: sidebarWidth }}>
                {chats.map((chat, index) => (
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
            </div>
        </ScrollArea>
    )
}

export default DialogList
