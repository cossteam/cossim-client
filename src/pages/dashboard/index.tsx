import useCommonStore from '@/stores/common'
import { memo, useMemo } from 'react'
import { Navigate } from 'react-router-dom'

const Dashboard = memo(() => {
    const commonStore = useCommonStore()

    const path = useMemo(() => {
        return commonStore.lastDialogId ? `/dashboard/message/${commonStore.lastDialogId}` : `/dashboard/message`
    }, [commonStore.lastDialogId])

    return <Navigate to={path} />
})

export default Dashboard
