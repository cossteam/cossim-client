import { Button, ConfigProvider } from 'antd'
import { beforeRouter } from './permission'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const App = () => {
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		beforeRouter(location, navigate)
	}, [])

	return (
		<ConfigProvider
			// theme={{
			// 	token: {
			// 		colorPrimary: '#00b96b',
			// 		borderRadius: 4
			// 	}
			// }}
			theme={{ cssVar: true, hashed: false }}
		>
			<Button type='primary'>22</Button>
			<Outlet />
		</ConfigProvider>
	)
}

export default App
