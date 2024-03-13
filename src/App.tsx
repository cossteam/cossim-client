import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { usePermission } from './permission'

function App() {
	usePermission()

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
			<RouterProvider router={router} />
		</ConfigProvider>
	)
}

export default App
