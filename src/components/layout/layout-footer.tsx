import { $t } from '@/i18n'
import { Flex, Typography } from 'antd'
import { useMemo } from 'react'
import { ChatIcon, ContactIcon } from '@/components/icon/icon'
import IconButton from '@/components/icon/icon-button'
import clsx from 'clsx'
import useCommonStore from '@/stores/common'
import { useNavigate, useParams } from 'react-router-dom'

const LayoutFooter = () => {
    const commonStore = useCommonStore()
    const params = useParams()
    const navigate = useNavigate()

    const menus = useMemo(
        () => [
            {
                title: $t('聊天'),
                icon: ChatIcon,
                path: commonStore.lastDialogId ? `/dashboard/message/${commonStore.lastDialogId}` : '/dashboard/message'
            },
            {
                title: $t('联系人'),
                icon: ContactIcon,
                path: '/dashboard/contact'
            }
        ],
        [commonStore.lastDialogId]
    )

    return (
        <Flex className="h-16 bg-background" justify="center" align="center" gap={10}>
            {menus.map((menu, index) => (
                <Flex
                    className={clsx(
                        'text-gray-500 px-4 cursor-pointer',
                        menu.path.includes(params.type || '') && 'text-primary'
                    )}
                    key={index}
                    justify="center"
                    align="center"
                    vertical
                    onClick={() => navigate(menu.path)}
                >
                    <IconButton className="text-2xl" buttonClassName="!p-0" component={menu.icon} />
                    <Typography.Text className="text-xs">{menu.title}</Typography.Text>
                </Flex>
            ))}
        </Flex>
    )
}

export default LayoutFooter
