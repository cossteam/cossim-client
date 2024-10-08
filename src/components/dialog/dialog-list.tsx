import { formatDate } from '@/lib/utils'
import { generateChatList } from '@/mock/data'
import { useRef, useState } from 'react'
import ListItem from '@/components/common/list-item'
import { useConfigStore } from '@/stores/config'
// import { VList, VListHandle } from '@/components/virtual-list/index'
import { DialogListItem } from '@/interface/model/dialog'
import { VList, Virtualizer } from 'virtua'
import { ScrollArea } from '@/ui/scroll-area'

const DialogList = () => {
    const [data, setData] = useState<DialogListItem[]>(generateChatList(15))

    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)

    // const ref = useRef<VListHandle>(null)
    // const isPrepend = useRef(false)

    const handleScroll = () => {
        console.log('end')
    }

    return (
        // <VList style={{ width: sidebarWidth }} onScroll={handleScroll} itemSize={72}>
        //     {data.map((chat, index) => (
        //         <ListItem
        //             key={index}
        //             src="https://picsum.photos/56"
        //             name={chat?.dialog_name}
        //             description={chat?.last_message?.content}
        //             right={{
        //                 date: formatDate(chat?.last_message?.send_at),
        //                 unreadCount: chat?.dialog_unread_count
        //             }}
        //         />
        //     ))}
        // </VList>
        // <ScrollArea className="scroll flex-1 overflow-y-auto">
        //     <VList className="h-96" itemSize={72} onScrollEnd={handleScroll}>
        //         {data.map((chat, index) => (
        //             <ListItem
        //                 key={index}
        //                 src="https://picsum.photos/56"
        //                 name={chat?.dialog_name}
        //                 description={chat?.last_message?.content}
        //                 right={{
        //                     date: formatDate(chat?.last_message?.send_at),
        //                     unreadCount: chat?.dialog_unread_count
        //                 }}
        //             />
        //         ))}
        //     </VList>
        // </ScrollArea>
        <ScrollArea>
            <VList style={{ height: 500 }} onScroll={handleScroll} itemSize={72}>
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
            </VList>
        </ScrollArea>
    )
}

export default DialogList
