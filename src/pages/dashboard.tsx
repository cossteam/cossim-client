import { Flex } from 'antd'
import LayoutSidebar from '@/components/layout/layout-sidebar'
import { Outlet } from 'react-router'
import useDialogHistory from '@/hooks/useDialogHistory'
import { memo } from 'react'

const Dashboard = memo(() => {
	useDialogHistory()

	return (
		<div>
			<Flex align="start">
				<LayoutSidebar />
				<Flex className="mobile:!flex !hidden flex-1">
					<Outlet />
				</Flex>
			</Flex>
		</div>
	)
})

export default Dashboard
