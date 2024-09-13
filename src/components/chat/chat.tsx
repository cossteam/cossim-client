import { Ellipsis } from 'lucide-react'
import ChatProvider from '@/components/provider/chat-provider'
import { useContext } from 'react'
import { ChatContext } from '@/context/chat-context'
import Drawer from './drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

const ChatHeader = () => {
    const { isDrawerOpen, update } = useContext(ChatContext)

    return (
        <div className="h-14 border-b border-muted-foreground/30 flex items-center px-4 justify-between">
            <Popover>
                <PopoverTrigger>
                    <h1 className="ellipsis flex-1 select-none">Next 老司机交流群（400）</h1>
                </PopoverTrigger>
                <PopoverContent>群信息/个人信息</PopoverContent>
            </Popover>
            <Ellipsis
                className="size-5 cursor-pointer hover:text-primary active:text-primary text-muted-foreground"
                onClick={() => update({ isDrawerOpen: !isDrawerOpen })}
            />
        </div>
    )
}

const ChatContent = () => {
    const { isDrawerOpen } = useContext(ChatContext)
    return (
        <div className="scroll flex-1 overflow-y-auto px-4 relative">
            <ChatListItem />
            {isDrawerOpen && <Drawer />}
        </div>
    )
}

const ChatFooter = () => {
    return <div className="h-16 border-t border-muted-foreground/30 flex items-center px-4 justify-between">Footer</div>
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
    aligin: 'left' | 'right' | 'center'
}

const ChatListItem = () => {
    return (
        <div className="flex w-full py-3">
            <div className="flex max-w-[80%] overflow-hidden gap-x-2">
                <img className="size-8 rounded-full flex-shrink-0" src="https://picsum.photos/48" alt="" />
                <div className="flex flex-col gap-y-0.5">
                    <h3 className="text-xs text-muted-foreground/80 select-none">小明</h3>
                    <div className="bg-primary px-2 py-1 rounded text-background text-sm leading-6 break-all">
                        hello
                        world！我来自中国，很开心人事你都是废话九二万吨和复活节很热的风格化何让个3会跟2会跟2和哥哥换个地方换个和
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
