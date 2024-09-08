import { useRoutes, useLocation, useNavigate } from 'react-router-dom'
import routes from '~react-pages'
import { useEffect, useMemo } from 'react'

const ToLogin = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/account/login')
    }, [])
    return null
}

const ToPages = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/')
    }, [])
    return null
}

interface BeforeRouterProps {
    isLogin: boolean
}

// 路由守卫
const BeforeRouter: React.FC<BeforeRouterProps> = ({ isLogin }) => {
    const routerView = useRoutes(routes)
    const location = useLocation()

    const isAccountpage = useMemo(() => location.pathname.includes('account'), [location.pathname])

    // 已经登录，访问登录页面，跳转到主页
    if (isAccountpage && isLogin) return <ToPages />
    // 未登录，访问非登录页面，跳转到登录页面
    // if (!isAccountpage && !isLogin) return <ToLogin />

    return routerView
}

export default BeforeRouter
