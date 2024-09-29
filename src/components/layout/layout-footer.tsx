import { $t } from '@/i18n'
import { Divider, Flex, Typography } from 'antd'
import { useMemo } from 'react'
import clsx from 'clsx'
import useCommonStore from '@/stores/common'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Users, ChatCircleDots } from "@phosphor-icons/react";

const height = 50

const LayoutFooter = () => {
    const commonStore = useCommonStore()
    const location = useLocation()
    const navigate = useNavigate()

    const menus = useMemo(() => [
        {
            title: $t('聊天'),
            icon: ChatCircleDots,
            path: commonStore.lastDialogId ? `/dashboard/message/${commonStore.lastDialogId}` : '/dashboard/message'
        },
        {
            title: $t('联系人'),
            icon: Users,
            path: '/dashboard/contact'
        },
        {
            title: $t('我'),
            icon: User,
            path: '/dashboard/profile'
        }
    ], [commonStore.lastDialogId])

    return (
        <>
            <Divider className="m-0" />
            <Flex className={`h-[${height}px] bg-background`} justify="center" align="center">
                {menus.map((menu, index) => {
                    // 判断当前菜单项是否激活
                    const isActive = location.pathname.includes(menu.path)
                    return (
                        <Flex
                            key={index}
                            className={clsx(
                                'text-gray-500 px-3 flex-1',
                                isActive && 'text-primary'
                            )}
                            justify="center"
                            align="center"
                            vertical
                            onClick={() => navigate(menu.path)}
                        >
                            <menu.icon
                                size={30}
                                color={isActive ? "#26B36D" : undefined}
                                weight={isActive ? "fill" : "thin"}
                            />
                            <Typography.Text className="text-[10px]">{menu.title}</Typography.Text>
                        </Flex>
                    )
                })}
            </Flex>
        </>
    )
}

export default LayoutFooter
