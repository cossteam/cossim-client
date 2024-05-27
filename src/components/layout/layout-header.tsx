import { $t } from '@/i18n'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { memo, useState } from 'react'
import LayoutDrawer from './layout-drawer'

export const headerHeight = 64

const LayoutHeader = memo(() => {
	const [open, setOpen] = useState<boolean>(false)
	return (
		<>
			<Flex className="sticky top-0 z-10 bg-background pl-3 pr-3" style={{ height: headerHeight }} align="center">
				<Button
					className="mr-1"
					type="text"
					size="large"
					icon={<MenuOutlined className="text-gray-500" />}
					onClick={() => setOpen(true)}
				/>
				<Flex className="flex-1 bg-background2 h-10 rounded px-5 cursor-pointer" align="center">
					<SearchOutlined className="mr-2 text-gray-500 text-base" />
					<Typography.Text className="text-gray-500 text-sm">{$t('搜索')}</Typography.Text>
				</Flex>
			</Flex>
			<LayoutDrawer open={open} onClose={() => setOpen(false)} setOpen={setOpen} />
		</>
	)
})

export default LayoutHeader
