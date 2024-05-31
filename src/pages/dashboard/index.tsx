import useCommonStore from '@/stores/common'
import { Avatar, Flex } from 'antd'
import { memo } from 'react'
import { Navigate } from 'react-router'

const Dashboard = memo(() => {
  const commonStore = useCommonStore()

  return commonStore.lastDialogId ? (
    <Navigate to={`/dashboard/${commonStore.lastDialogId}`} />
  ) : (
    <Flex className="flex-1 h-screen" align="center" justify="center" vertical>
      <Avatar className="mb-5" size={128} />
    </Flex>
  )
})

export default Dashboard
