import { useAuthStore } from '@/stores/auth'
import { Navigate, useLocation } from 'react-router-dom'

const withAuth = (Component: React.ComponentType) => {
    const AuthenticatedComponent = (props: any) => {
        const location = useLocation()
        const isLogged = !!useAuthStore((state) => state.token)
        const whiteList = ['/sign-in', '/sign-up']

        // 没有登录且当前路由不在白名单中，跳转到登录页面
        // if (!isLogged && !whiteList.includes(location.pathname)) {
        //     return <Navigate to="/sign-in" state={{ from: location.pathname }} />
        // }

        // 已登录，但访问登录注册页面，跳转到主页
        if (isLogged && whiteList.includes(location.pathname)) {
            return <Navigate to="/" />
        }

        return <Component {...props} />
    }

    return AuthenticatedComponent
}

export default withAuth
