import { NavigateFunction, Location } from 'react-router-dom'
import useUserStore from '@/stores/user'

export const beforeRouter = (location: Location<any>, navigate: NavigateFunction) => {
	const userStore = useUserStore.getState()

	// 未登录
	if (!userStore.token) {
		return navigate('/login', { replace: true })
	}

	// 已经登陆
	if (['/login'].includes(location.pathname)) {
		return navigate('/', { replace: true })
	}
}
