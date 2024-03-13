import { getAuth } from '@/utils/auth'
import {  useNavigate } from 'react-router-dom'
import { TOKEN } from '@/shared'

export const usePermission = () => {
	// const location = useLocation()
	const navigate = useNavigate()

	const auth = getAuth(TOKEN)

	// 未登录
	if (!auth) {
		return navigate('/login')
	}

	// 已经登陆
	// if (['/login'].includes(location.pathname)) {
	// 	return navigate('/')
	// }
}
