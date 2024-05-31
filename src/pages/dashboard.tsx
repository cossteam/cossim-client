import { Flex } from 'antd'
import LayoutSidebar from '@/components/layout/layout-sidebar'
import { Outlet } from 'react-router'
import useDialogHistory from '@/hooks/useDialogHistory'

const Dashboard = () => {
  useDialogHistory()

  return (
    <Flex className="w-full" align="start">
      <LayoutSidebar />
      <Flex className="mobile:!flex !hidden flex-1">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default Dashboard
