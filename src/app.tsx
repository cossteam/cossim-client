import { ConfigProvider } from 'antd'
import { Suspense, memo } from 'react'
import useCommonStore from '@/stores/common'
import Loading from '@/components/loading'
import { useRoutes } from 'react-router'
import routes from '~react-pages'
import { App as AppComponent } from 'antd'
import useAuth from '@/hooks/useLogin'

const App = memo(() => {
	const commonStore = useCommonStore()
	// 鉴权
	useAuth()
	return (
		<ConfigProvider theme={{ token: { colorPrimary: commonStore.themeColor, borderRadius: 4, fontSize: 16 } }}>
			<AppComponent>
				<Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
			</AppComponent>
		</ConfigProvider>
	)
})

export default App
