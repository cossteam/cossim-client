import { ConfigProvider } from 'antd'
import { Suspense, memo, useEffect, useState } from 'react'
import useCommonStore from '@/stores/common'
import Loading from '@/components/loading'
import { useRoutes } from 'react-router'
import routes from '~react-pages'
import { App as AppComponent } from 'antd'
import useAuth from '@/hooks/useLogin'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { Locale } from 'antd/es/locale'
// import Call from '@/components/call'

const App = memo(() => {
	const commonStore = useCommonStore()

	const [locale, setLocal] = useState<Locale>(enUS)

	useEffect(() => {
		if (localStorage.getItem('locale') !== 'zh-CN') {
			setLocal(zhCN)
			dayjs.locale('zh-cn')
		} else {
			setLocal(enUS)
			dayjs.locale('en')
		}
	}, [])

	// 鉴权
	useAuth()
	console.log(useRoutes(routes))

	return (
		<ConfigProvider
			theme={{ token: { colorPrimary: commonStore.themeColor, borderRadius: 4, fontSize: 16 } }}
			locale={locale}
		>
			<AppComponent>
				<Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
				{/* 通话组件 */}
				{/* <Call /> */}
			</AppComponent>
		</ConfigProvider>
	)
})

export default App
