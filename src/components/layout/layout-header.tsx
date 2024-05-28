import { $t } from '@/i18n'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons'
import { Flex, Typography } from 'antd'
import { memo, useState } from 'react'
import LayoutDrawer from './layout-drawer'
import IconButton from '@/components/icon/icon-button'

export const headerHeight = 64

const LayoutHeader = memo(() => {
	const [open, setOpen] = useState<boolean>(false)
	return (
		<>
			<Flex className="sticky top-0 z-10 bg-background pl-3 pr-3" style={{ height: headerHeight }} align="center">
				<IconButton
					className="text-gray-500 text-xl"
					buttonClassName="mr-1"
					component={MenuOutlined}
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
