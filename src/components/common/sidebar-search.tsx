import { buttonVariants } from '@/ui/button'
import { Input } from '@/ui/input'
import { MessageSquarePlus, Plus, Search, UserRoundPlus } from 'lucide-react'
import { useRef, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useClickOutside } from '@reactuses/core'

const menus = [
    {
        name: '发起群聊',
        icon: MessageSquarePlus
    },
    {
        name: '加好友/群',
        icon: UserRoundPlus
    }
]

const SidebarSearch = () => {
    const [ketword, setKeyword] = useState('')
    const [contentShow, setContentShow] = useState(false)

    const sidebarRef = useRef<HTMLDivElement>(null)
    useClickOutside(sidebarRef, () => {
        setContentShow(false)
    })

    return (
        <div className="px-2 overflow-hidden relative flex flex-col h-full" ref={sidebarRef}>
            <div className="flex w-full gap-x-2 sticky top-0 z-50 mb-3">
                <div className="border border-gray-300 rounded-md flex items-center px-2 gap-x-1.5 flex-1">
                    <Search className="size-4 text-gray-300" />
                    <Input
                        className="flex-1 focus-within:border-transparent"
                        type="text"
                        placeholder="搜索"
                        variant="ghost"
                        value={ketword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onFocus={() => setContentShow(true)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                'px-2 border border-gray-300 rounded-md'
                            )}
                        >
                            <Plus className="size-5 text-gray-400" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right">
                        {menus.map((menu, index) => {
                            return (
                                <DropdownMenuItem className="leading-6 align-middle mb-1 last-of-type:mb-0" key={index}>
                                    <menu.icon className="size-4 mr-1.5 text-gray-500" />
                                    <span className="text-sm"> {menu.name}</span>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {contentShow && (
                <div className="relative bg-background flex-1">
                    {!ketword && (
                        <div className="flex items-center gap-x-2 cursor-pointer hover:bg-muted-foreground/10 p-2 rounded-md duration-300">
                            <div className="bg-primary/50 size-10 rounded-full flex items-center justify-center">
                                <Search className="size-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-sm">进入全网搜索</h2>
                                <p className="text-xs text-gray-500">搜索用户、群聊、文件、动态等</p>
                            </div>
                        </div>
                    )}

                    {/* TODO: 搜索结果展示 */}
                    {ketword && (
                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center gap-x-2 cursor-pointer hover:bg-muted-foreground/10 p-2 rounded-md duration-300">
                                <div className="bg-primary/50 size-10 rounded-full flex items-center justify-center">
                                    <Search className="size-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-sm">搜索结果</h2>
                                    <p className="text-xs text-gray-500">共找到 {10} 个结果</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SidebarSearch
