import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button'
import { CircleHelp, LogOut, Menu, MessageSquare, Settings, ShieldAlert, SquareArrowUp, Users } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Outlet, Link } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import Test from '@/components/test'

const sideRoutes = [
    {
        path: '/',
        name: 'Home',
        icon: MessageSquare
    },
    {
        path: '/friends',
        name: 'Friends',
        icon: Users
    }
]

const toolbarMenus = [
    {
        name: '检查更新',
        icon: SquareArrowUp,
        hanlder: () => {}
    },
    {
        name: '帮助',
        icon: CircleHelp,
        hanlder: () => {}
    },
    {
        name: '设置',
        icon: Settings,
        hanlder: () => {}
    },
    {
        name: '关于',
        icon: ShieldAlert,
        hanlder: () => {}
    },
    {
        name: '退出登录',
        icon: LogOut,
        hanlder: () => {}
    }
]

const HomePage = () => {
    const location = useLocation()
    return (
        <div className="flex h-screen min-h-[450px] overflow-hidden">
            <div className="bg-background w-14 py-4 flex flex-col items-center border-r">
                <div className="inline-block size-8 rounded-full bg-primary relative mb-10">
                    <img className="object-cover w-full h-full rounded-full " src="https://picsum.photos/40" alt="" />
                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-primary z-10 border-2 border-white"></div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-y-3">
                    {sideRoutes.map((route, index) => {
                        const isActive = location.pathname === route.path
                        return (
                            <Link
                                className={cn(
                                    buttonVariants({
                                        variant: 'ghost'
                                    }),
                                    'px-2 select-none',
                                    {
                                        'bg-muted-foreground/10': isActive
                                    }
                                )}
                                key={index}
                                to={route.path}
                            >
                                <route.icon
                                    className={cn('size-5', {
                                        'text-primary fill-primary': isActive
                                    })}
                                />
                            </Link>
                        )
                    })}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className={cn(buttonVariants({ variant: 'ghost' }), 'px-2 select-none')}>
                            <Menu className={cn('size-5')} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right">
                        {toolbarMenus.map((menu, index) => {
                            return (
                                <DropdownMenuItem
                                    className="leading-6 align-middle mb-1 last-of-type:mb-0"
                                    key={index}
                                    onClick={menu.hanlder}
                                >
                                    <menu.icon className="size-4 mr-1.5 text-gray-500" />
                                    <span className="text-sm"> {menu.name}</span>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex-1 h-full">
                <Outlet />
            </div>
        </div>
    )
}

export default HomePage
