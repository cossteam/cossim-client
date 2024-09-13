import { formatDate } from '@/lib/utils'
import { generateChatList } from '@/mock/data'
import { DialogInterface } from '@/types/common'
import { Badge } from '@/ui/badge'
import { useMemo } from 'react'

const ChatItem: React.FC<{ chat: DialogInterface }> = ({ chat }) => {
    return (
        <div className="w-full hover:bg-muted-foreground/10 p-2 cursor-pointer duration-300 flex gap-x-1.5 items-center">
            <div className="flex items-center size-14 justify-center flex-shrink-0">
                <img className="rounded-full size-12" src="https://picsum.photos/56" alt="" />
            </div>
            <div className="flex flex-1 flex-col gap-y-1.5 overflow-hidden">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis flex-1">{chat.dialog_name}</p>
                <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs flex-1 text-gray-700">
                    {chat.last_message.content}
                </p>
            </div>
            <div className="w-12 flex-shrink-0 flex flex-col items-end gap-y-1.5">
                <div className="text-xs text-gray-700 whitespace-nowrap">{formatDate(chat.last_message.send_at)}</div>
                <Badge className="px-1.5 py-0 rounded-full bg-red-500" variant="destructive">
                    {chat.dialog_unread_count}
                </Badge>
            </div>
        </div>
    )
}

// TODO: add skeleton loading
const ChatListSkeleton = () => {
    return <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md"></div>
}

// TODO: add empty state
const ChatListEmpty = () => {
    return (
        <div className="w-full h-40 flex justify-center items-center">
            <p className="text-gray-700">暂无聊天记录</p>
        </div>
    )
}

const ChatList = () => {
    const chats = useMemo(() => generateChatList(15), [])
    // TODO: 添加虚拟滚动
    return (
        <div className="scroll w-full h-full overflow-y-auto">
            {chats.map((chat, index) => (
                <ChatItem key={index} chat={chat} />
            ))}
        </div>
    )
}

export default ChatList
