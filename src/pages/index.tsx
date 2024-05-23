import { Navigate } from 'react-router-dom'
import useCommonStore from '@/stores/common'
import { memo } from 'react'

/**
 * 在此可以做路由鉴权，比如判断是否登录，是否有权限访问某个页面等等
 * @returns
 */
const Home = memo(() => {
	const commonStore = useCommonStore()
	return <Navigate to={`/${commonStore.lang}`} />
})

export default Home
