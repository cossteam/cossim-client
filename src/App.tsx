import { beforeRouter } from './permission'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AliveScope } from 'react-activation'

const App = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		// 权限拦截
		beforeRouter(location, navigate)
	}, [])

	return (
		<AliveScope>
			<Outlet />
		</AliveScope>
	)
}

export default App
