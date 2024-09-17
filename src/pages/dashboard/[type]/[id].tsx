import Message from '@/components/messages'
import { useCallback, useEffect, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { ROUTE } from '@/utils/enum'
import useCommonStore from '@/stores/common'
import NewRequest from '@/components/contact/new-request'
import UserInfo from '@/components/profile/user-info'
import { useAuthStore } from '@/stores/auth'
import ContactUserInfo from '@/components/contact/user-info'
// import { useAuthStore } from '@/stores/auth'

// TODO: 添加个人信息页
const TestContact = () => <div>TestContactInfo</div>

// 生成假的用户数据
const fakeUser = {
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    nickname: '张三',
    id: 'user123',
    email: 'zhangsan@example.com',
    bio: '这是一个测试用户的个人简介'
}

const Dialog = () => {
    const params = useParams()
    const commonStore = useCommonStore()
    const userinfo = useMemo(() => useAuthStore.getState().userInfo, [])

    const renderComponent = useCallback(() => {
        switch (params.type) {
            case ROUTE.MESSAGE:
                return <Message />
            case ROUTE.CONTACT:
                return params.id === 'request' ? <NewRequest /> : <ContactUserInfo userId={params.id as string} />
            case ROUTE.PROFILE:
                return params.id === 'user-info' ? (
                    <UserInfo 
                        avatarUrl={userinfo.avatar}
                        nickname={userinfo.nickname}
                        userId={userinfo.coss_id}
                        email={userinfo.email}
                        bio={userinfo.signature}
                    />
                ) : <TestContact />
            default:
                console.log('无效的路由类型:', params.type)
                return <Navigate to="/" />
        }
    }, [params.type, params.id])

    const comp = useMemo(() => renderComponent(), [renderComponent])

    useEffect(() => {
        if (params.type === ROUTE.MESSAGE && params.id) {
            commonStore.update({ lastDialogId: Number(params.id) })
        }
    }, [params.type, params.id, commonStore])

    return comp
}

export default Dialog
