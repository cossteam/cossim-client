import Message from '@/components/messages'
import { useEffect, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { ROUTE } from '@/utils/enum'
import useCommonStore from '@/stores/common'
// import Profile from '@/components/profile'

// TODO: 添加个人信息页
const TestContact = () => <div>TestContactInfo</div>

const Dialog = () => {
    const params = useParams()
    const commonStore = useCommonStore()

    const comp = useMemo(() => {
        switch (params.type) {
            case ROUTE.MESSAGE:
                return <Message />
            case ROUTE.CONTACT:
                console.log('params.type',params.type)
                return <TestContact />
            case ROUTE.PROFILE:
                return <TestContact />
            default:
                console.log('params.type',params.type)
                return <Navigate to="/" />
        }
    }, [params.type])

    useEffect(() => {
        if (params.type === ROUTE.MESSAGE && params.id) {
            commonStore.update({ lastDialogId: Number(params.id) })
        }
    }, [params.type, params.id])

    return comp
}

export default Dialog
