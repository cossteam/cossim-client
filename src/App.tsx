import { ConfigProvider } from 'antd'
// import { usePermission } from './permission'
import { Outlet } from 'react-router-dom'


const App = () => {
	// 权限控制
	// usePermission()

	console.log('11')

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
			<Outlet />
		</ConfigProvider>
	)
}

export default App
