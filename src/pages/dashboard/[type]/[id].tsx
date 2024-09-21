import { useCallback, useEffect, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { ROUTE } from '@/utils/enum'
import useCommonStore from '@/stores/common'
import { useAuthStore } from '@/stores/auth'
import Message from '@/components/messages'
import NewRequest from '@/components/contact/new-request'
import UserInfo from '@/components/profile/user-info'
import ContactUserInfo from '@/components/contact/user-info'

const TestContact = () => <div>TestContactInfo</div>

const Dialog = () => {
    const { type, id } = useParams()
    const { update } = useCommonStore()
    const userInfo = useAuthStore(state => state.userInfo)

    const renderComponent = useCallback(() => {
        switch (type) {
            case ROUTE.MESSAGE:
                return <Message />
            case ROUTE.CONTACT:
                switch (id) {
                    case 'request': return <NewRequest />
                    case 'group': return <div>群组页面</div>
                    case 'tag': return <div>标签页面</div>
                    default: return <ContactUserInfo userId={id as string} />
                }
            case ROUTE.PROFILE:
                return id === 'user-info' ? (
                    <UserInfo 
                        avatarUrl={userInfo.avatar}
                        nickname={userInfo.nickname}
                        userId={userInfo.user_id}
                        email={userInfo.email}
                        bio={userInfo.signature}
                    />
                ) : <TestContact />
            default:
                console.log('无效的路由类型:', type)
                return <Navigate to="/" />
        }
    }, [type, id, userInfo])

    useEffect(() => {
        if (type === ROUTE.MESSAGE && id) {
            update({ lastDialogId: Number(id) })
        }
    }, [type, id, update])

    return useMemo(() => renderComponent(), [renderComponent])
}

export default Dialog
