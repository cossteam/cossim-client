import { ScrollArea } from '@/ui/scroll-area'
import { ArrowUp, Link, Image } from 'lucide-react'
import { useState } from 'react'
import ChatInput from './chat-input'

function ChatFooter() {
    const [isMention, setIsMention] = useState(false)

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = (e.nativeEvent as InputEvent).data as string
        const isMention = ['@'].includes(text)
        setIsMention(isMention)
    }

    return (
        <div className="py-3 flex items-end px-4 justify-between w-full shadow-sm flex-shrink-0 relative">
            <div className="group border-slate-300 bg-foreground/10 w-full py-3 flex justify-between px-3 items-end border bg-slate-50 focus-within:border-slate-500 rounded-lg">
                <div className="flex items-center space-x-4">
                    <Link className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} />
                    <Image className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} />
                </div>

                <ChatInput />

                <div className="flex-shrink-0">
                    {/* <Send className="text-muted-foreground/50 group-focus-within:text-muted-foreground" size={20} /> */}
                    <div className="bg-muted-foreground/50 rounded-full p-0.5">
                        <ArrowUp className="text-white" size={20} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatFooter
