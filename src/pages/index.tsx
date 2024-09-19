import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button'
import { CircleHelp, LogOut, Menu, MessageSquare, Settings, ShieldAlert, SquareArrowUp, Users } from 'lucide-react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { useCallback, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth'

enum RouteNames {
    Home = 'home',
    Contacts = 'contacts'
}

const sideRoutes = [
    {
        path: '/',
        name: RouteNames.Home,
        icon: MessageSquare
    },
    {
        path: '/contacts',
        name: RouteNames.Contacts,
        icon: Users
    }
]

const HomePage = () => {
    const location = useLocation()

    const lgout = useAuthStore((state) => state.lgout)

    const { t } = useTranslation()

    const toolbarMenus = useMemo(
        () => [
            {
                name: t('checkUpdate'),
                icon: SquareArrowUp,
                hanlder: () => {}
            },
            {
                name: t('help'),
                icon: CircleHelp,
                hanlder: () => {}
            },
            {
                name: t('setting'),
                icon: Settings,
                hanlder: () => {}
            },
            {
                name: t('about'),
                icon: ShieldAlert,
                hanlder: () => {}
            },
            {
                name: t('quit'),
                icon: LogOut,
                hanlder: lgout
            }
        ],
        []
    )

    const isActive = useCallback(
        (path: string) => {
            const pathname = location.pathname
            if (path === '/') return pathname === path
            return pathname.includes(path)
        },
        [location]
    )

    return (
        <div className="flex h-screen min-h-[450px] overflow-hidden">
            <div className="bg-background w-14 py-4 flex flex-col items-center border-r">
                <div className="inline-block size-8 rounded-full bg-primary relative mb-10">
                    <img className="object-cover w-full h-full rounded-full " src="https://picsum.photos/40" alt="" />
                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-primary z-10 border-2 border-white"></div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-y-3">
                    {sideRoutes.map((route, index) => {
                        return (
                            <Link
                                className={cn(
                                    buttonVariants({
                                        variant: 'ghost'
                                    }),
                                    'px-2 select-none',
                                    {
                                        'bg-muted-foreground/10': isActive(route.path)
                                    }
                                )}
                                key={index}
                                to={route.path}
                            >
                                <route.icon
                                    className={cn('size-5', {
                                        'text-primary fill-primary': isActive(route.path)
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
