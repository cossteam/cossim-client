import { buttonVariants } from '@/ui/button'
import { Input } from '@/ui/input'
import { MessageSquarePlus, Plus, Search, UserRoundPlus } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useClickOutside } from '@reactuses/core'
import { useTranslation } from 'react-i18next'

const SidebarSearch = () => {
    const [ketword, setKeyword] = useState('')
    const [contentShow, setContentShow] = useState(false)

    const sidebarRef = useRef<HTMLDivElement>(null)
    useClickOutside(sidebarRef, () => {
        setContentShow(false)
    })

    const { t } = useTranslation()

    const menus = useMemo(
        () => [
            {
                name: t('groupCreate'),
                icon: MessageSquarePlus
            },
            {
                name: t('grouporUserAdd'),
                icon: UserRoundPlus
            }
        ],
        []
    )

    return (
        <div
            className={cn('px-2 flex flex-col sticky top-0 z-50 pt-3 bg-background', {
                'h-full': contentShow
            })}
            ref={sidebarRef}
        >
            <div className="flex w-full gap-x-2 sticky top-0 z-50 items-start pb-2">
                <div className="border border-gray-300 rounded-md flex items-center px-2 gap-x-1 flex-1">
                    <Search className="size-4 text-gray-300" />
                    <Input
                        className="flex-1 focus-within:border-transparent"
                        type="text"
                        placeholder={t('search')}
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
                <div className="scroll bg-background w-full absolute top-16 z-50 left-0 px-2 overflow-x-hidden overflow-y-auto">
                    {!ketword && (
                        <div className="flex items-center gap-x-2 cursor-pointer hover:bg-muted-foreground/10 active:bg-muted-foreground/10 p-2 rounded-md duration-300">
                            <div className="bg-primary/50 size-10 rounded-full flex items-center justify-center">
                                <Search className="size-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-sm">{t('globalSearch')}</h2>
                                <p className="text-xs text-gray-500">{t('globalSearchDesc')}</p>
                            </div>
                        </div>
                    )}

                    {/* TODO: 搜索结果展示 */}
                    {ketword &&
                        Array.from({ length: 20 }).map((_, index) => (
                            <div className="flex flex-col gap-y-2" key={index}>
                                <div className="flex items-center gap-x-2 cursor-pointer hover:bg-muted-foreground/10 active:bg-muted-foreground/10 p-2 rounded-md duration-300">
                                    <div className="bg-primary/50 size-10 rounded-full flex items-center justify-center">
                                        <Search className="size-6 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-sm">{t('searchResult')}</h2>
                                        <p className="text-xs text-gray-500">{t('searchResultDesc', { count: 10 })}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}

export default SidebarSearch
