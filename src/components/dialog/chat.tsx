import { Ellipsis, ArrowUp } from 'lucide-react'
import ChatProvider from '@/components/provider/chat-provider'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { generateMessageList } from '@/mock/data'
import { ScrollArea } from '@/ui/scroll-area'
import { Message } from '@/interface/model/dialog'
// import VirtualizedList from '../virtual-list/virtual-list'
import Example from '../virtual-list/example'
import Example2 from '../virtual-list/virtual-list'
import Example3 from '../virtual-list/vir'
// import VirtualListWrapper from '../virtual-list/virtual'
// import { VirtualizedList } from '@/components/virtual-list/chat-list'
// import Example from '@/components/virtual-list/virtual'

const ChatHeader = () => {
    return (
        <div className="h-16 border-b flex justify-between items-center w-full px-5 py-2 shadow-sm flex-shrink-0">
            <div className="flex items-center">
                <p className="">Mircel Jones</p>
            </div>
            <div className="flex items-center space-x-5">
                <Ellipsis className="size-5 cursor-pointer hover:text-primary active:text-primary text-muted-foreground" />
            </div>
        </div>
    )
}

const meessage = generateMessageList(1000)

const ChatContent = () => {
    const renderItem = useCallback((item: Message) => {
        return <ChatListItem key={item.msg_id} item={item} aligin={Math.random() < 0.5 ? 'left' : 'right'} />
    }, [])

    return (
        <div className="flex-1 relative flex-shrink-0 overflow-hidden">
            {/* <VirtualizedList height={300} data={meessage} inverse={true} dataLength={meessage.length}>
                {renderItem}
            </VirtualizedList> */}
            {/* <Example /> */}
            <Example3 />
            {/* <VirtualListWrapper /> */}
            {/* <Example data={meessage} renderItem={renderItem} /> */}
            {/* <ScrollArea> */}
            {/* <VirtualizedList data={meessage} inverse={true} renderItem={renderItem} /> */}
            {/* </ScrollArea> */}
            {/* <VirtualizedList data={meessage} inverse={true} renderItem={renderItem} /> */}
        </div>
    )
}

const ChatFooter = () => {
    return (
        <div className="py-3 flex items-center px-4 justify-between w-full shadow-sm flex-shrink-0">
            <div className="group bg-foreground/10 w-full min-h-12 flex justify-between px-3 items-center border border-transparent bg-slate-50 focus-within:border-slate-300 rounded-lg">
                {/* <div className="flex items-center space-x-4">
                    <Link className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} />
                    <Image className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} />
                </div> */}

                <ScrollArea className="flex-1 relative max-h-[150px]">
                    <div
                        className="w-full px-3 bg-transparent outline-none placeholder:text-slate-400"
                        contentEditable
                    />
                </ScrollArea>

                <div className="flex-shrink-0">
                    {/* <Send className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} /> */}
                    <div className="bg-muted-foreground/50 rounded-full p-1.5">
                        <ArrowUp className="text-white" size={20} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Chat = () => {
    return (
        <ChatProvider>
            <div className="h-full flex flex-col">
                <ChatHeader />
                <ChatContent />

                <ChatFooter />
            </div>
        </ChatProvider>
    )
}

interface ChatListItemProps {
    aligin?: 'left' | 'right'
    item: Message
}

const ChatListItem: React.FC<ChatListItemProps> = ({ aligin = 'left', item }) => {
    // const isSelf = useMemo(() => item.sender_id, [item.sender_id])

    const baseLayout = useMemo(
        () => ({
            'justify-start': aligin === 'left',
            'justify-end': aligin === 'right'
        }),
        [aligin]
    )

    const renderContent = useCallback(() => {
        return (
            <div
                className={cn('mt-2 w-auto max-w-full p-4 rounded-b-xl', {
                    'rounded-tr-xl bg-muted-foreground/10': aligin === 'left',
                    'rounded-tl-xl bg-primary/10': aligin === 'right'
                })}
            >
                <p className="text-sm break-before-auto break-all">{item.content}</p>
            </div>
        )
    }, [])

    return (
        <div className={cn('w-full flex py-3 px-4', baseLayout)}>
            <div
                className={cn('w-4/5 flex flex-col', {
                    'items-start': aligin === 'left',
                    'items-end': aligin === 'right'
                })}
            >
                <div className="flex items-center gap-x-2">
                    <img
                        className={cn('size-5 overflow-hidden rounded-full', {
                            'order-first': aligin === 'left',
                            'order-last': aligin === 'right'
                        })}
                        src="https://picsum.photos/48"
                        alt=""
                    />
                    <span className="text-xs text-foreground/80">{item?.sender_info?.name}</span>
                </div>

                {renderContent()}

                <div className={cn('flex mt-1 px-1', baseLayout)}>
                    <span className="text-slate-400 text-xs">12:30</span>
                </div>
            </div>
        </div>
    )
}

export default Chat
