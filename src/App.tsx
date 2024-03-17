import { beforeRouter } from './permission'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { App as AppComponent } from 'antd'
import './App.scss'

const App = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		// 权限拦截
		beforeRouter(location, navigate)
	}, [])

	return (
		<AppComponent className='app'>
			<Outlet />
		</AppComponent>
	)
}

export default App
