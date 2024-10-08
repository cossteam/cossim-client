import { Ellipsis } from 'lucide-react'

function ChatHeader() {
    return (
        <div className="h-16 border-b flex justify-between items-center w-full px-5 py-2 shadow-sm flex-shrink-0 relative z-[99]">
            <div className="flex items-center">
                <p className="">Mircel Jones</p>
            </div>
            <div className="flex items-center space-x-5">
                <Ellipsis className="size-5 cursor-pointer hover:text-primary active:text-primary text-muted-foreground" />
            </div>
        </div>
    )
}
export default ChatHeader
