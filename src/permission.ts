import { getAuth } from '@/utils/auth'
import { NavigateFunction, Location } from 'react-router-dom'
import { TOKEN } from '@/shared'

export const beforeRouter = (location: Location<any>, navigate: NavigateFunction) => {
	const auth = getAuth(TOKEN)

	// 未登录
	if (!auth) {
		return navigate('/login', { replace: true })
	}

	// 已经登陆
	if (['/login'].includes(location.pathname)) {
		return navigate('/', { replace: true })
	}
}
