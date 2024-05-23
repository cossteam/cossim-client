import { Navigate } from 'react-router-dom'

/**
 * 在此可以做路由鉴权，比如判断是否登录，是否有权限访问某个页面等等
 * @returns
 */
const App = () => {
	return <Navigate to="/zh" />
}

export default App
