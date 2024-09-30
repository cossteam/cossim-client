import { Flex } from 'antd'
import LayoutSidebar from '@/components/layout/layout-sidebar'
import { Outlet } from 'react-router-dom'
import useDialogHistory from '@/hooks/useDialogHistory'
import useFetchDialogList from '@/hooks/useFetchDialogList'
import useContact from '@/hooks/useContact'

const Dashboard = () => {
    useDialogHistory()
    useFetchDialogList()
    useContact()

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
