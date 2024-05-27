import { Flex } from 'antd'
import LayoutSidebar from '@/components/layout/layout-sidebar'
import { Outlet } from 'react-router'

const Dashboard = () => {
	return (
		<div>
			<Flex align="start">
				<LayoutSidebar />
				<Flex className="w750:!flex !hidden flex-1">
					<Outlet />
				</Flex>
			</Flex>
		</div>
	)
}

export default Dashboard
