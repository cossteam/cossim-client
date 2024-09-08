import { useAuthStore } from '@/stores/auth'
import { Navigate, useLocation } from 'react-router-dom'

const withAuth = (Component: React.ComponentType) => {
    const AuthenticatedComponent = (props: any) => {
        const location = useLocation()
        const isLogged = !!useAuthStore((state) => state.token)
        const whiteList = ['/sign-in', '/sign-up']

        if (!isLogged && !whiteList.includes(location.pathname)) {
            return <Navigate to="/sign-in" state={{ from: location.pathname }} />
        }

        return <Component {...props} />
    }

    return AuthenticatedComponent
}

export default withAuth
