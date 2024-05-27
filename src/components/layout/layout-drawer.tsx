import { $t } from '@/i18n'
import { generateUserInfo } from '@/mock/data'
import { SettingOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Avatar, Drawer, DrawerProps, Flex, Divider, Typography, Switch } from 'antd'
import { memo, useMemo, useState } from 'react'
import CustomIcon from '@/components/icon'
import Modal from '@/components/modal'
import { LightIcon, DarkIcon } from '@/components/icon/icon'
import useCommonStore from '@/stores/common'
import { THEME } from '@/utils/enum'
import { useWindowSize } from '@reactuses/core'
import { SMALL_SCREEN } from '@/utils/constants'
import type { DrawerStyles } from 'antd/es/drawer/DrawerPanel'

interface Menus {
	icon: React.ForwardRefExoticComponent<any>
	title: string
}

interface LayoutDrawerProps extends DrawerProps {
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const userInfo = generateUserInfo()

const drawerStyles: DrawerStyles = {
	body: {
		padding: '24px 0px'
	}
}

const LayoutDrawer: React.FC<Partial<LayoutDrawerProps>> = memo((props) => {
	const commonStore = useCommonStore()
	const { width } = useWindowSize()

	const isLight = useMemo(() => commonStore.theme === THEME.LIGHT, [commonStore.theme])

	const menus = useMemo<Menus[]>(
		() => [
			{
				icon: UsergroupAddOutlined,
				title: $t('新建群组')
			},
			{
				icon: UserOutlined,
				title: $t('联系人')
			},
			{
				icon: SettingOutlined,
				title: $t('设置')
			}
		],
		[]
	)

	const handlerMenusClick = (item: Menus) => {
		props.setOpen && props.setOpen(false)
		setTitle(item.title)
		setModalOpen(true)
	}

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [title, setTitle] = useState<string>('')

	return (
		<>
			<Drawer
				className="p-0"
				width={width < SMALL_SCREEN ? '70%' : '400'}
				placement="left"
				closable={false}
				styles={drawerStyles}
				{...props}
			>
				<Flex className="w750:px-5 px-3" align="center">
					<Avatar className="mr-4" src={userInfo.avatar} size={64} />
					<Flex vertical>
						<Typography.Text className="!mb-1 font-bold w750:text-xl text-lg">
							{userInfo.nickname}
						</Typography.Text>
						<Typography.Text className="break-all line-clamp-1 w750:text-base text-sm">
							{userInfo.email}
						</Typography.Text>
					</Flex>
				</Flex>

				<Divider />

				<Flex vertical>
					{menus.map((item, index) => (
						<Flex
							className="w750:py-3 py-2 w750:px-5 px-4 select-none hover:bg-background-hover cursor-pointer rounded"
							key={index}
							gap="middle"
							onClick={() => handlerMenusClick(item)}
						>
							<CustomIcon className="w750:text-2xl text-xl text-gray-500" component={item.icon} />
							<Typography.Text className="w750:text-lg text-base">{item.title}</Typography.Text>
						</Flex>
					))}
					<Flex
						className="w750:py-3 py-2 w750:px-5 px-4 select-none hover:bg-background-hover cursor-pointer rounded"
						gap="middle"
						justify="space-between"
						onClick={() => commonStore.update({ theme: isLight ? THEME.DARK : THEME.LIGHT })}
					>
						<Flex gap="middle">
							<CustomIcon
								className="w750:text-2xl text-xl text-gray-500"
								component={isLight ? DarkIcon : LightIcon}
							/>
							<Typography.Text className="w750:text-lg text-base">
								{isLight ? $t('夜间模式') : $t('日间模式')}
							</Typography.Text>
						</Flex>
						<Switch checked={!isLight} />
					</Flex>
				</Flex>
			</Drawer>

			<Modal open={modalOpen} onCancel={() => setModalOpen(false)} title={title}>
				111
			</Modal>
		</>
	)
})

export default LayoutDrawer
