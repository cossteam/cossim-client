import { ConfigProvider } from 'antd'
import { Suspense, memo, useEffect } from 'react'
import { LANG } from '@/utils/constants'
import useCommonStore from '@/stores/common'
import { defaultLanguage } from '@/i18n'
import Loading from '@/components/loading'
import { useRoutes } from 'react-router'
import routes from '~react-pages'

const App = memo(() => {
	const commonStore = useCommonStore()

	useEffect(() => {
		const lang = localStorage.getItem(LANG) ?? defaultLanguage
		commonStore.update({ lang })
	}, [])

	return (
		<ConfigProvider theme={{ token: { colorPrimary: commonStore.themeColor, borderRadius: 4 } }}>
			<Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
		</ConfigProvider>
	)
})

export default App
