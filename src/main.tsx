import ReactDOM from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import Loading from '@/components/loading'
import '@/i18n'
import '@/styles/base.scss'
import { ConfigProvider } from 'antd'
import useCommonStore from '@/stores/common'

const commonStore = useCommonStore.getState()
commonStore.init()

// eslint-disable-next-line react-refresh/only-export-components
const App = () => (
	<ConfigProvider>
		<Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>
	</ConfigProvider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
)
