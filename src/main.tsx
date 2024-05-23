import useThemeStore from '@/stores/theme'
import ReactDOM from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import Loading from '@/components/loading'
import '@/i18n'
import '@/styles/base.scss'
import { ConfigProvider } from 'antd'

const themeStore = useThemeStore.getState()
themeStore.init()

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

console.log('🚀 ~ file: main.tsx: 当前主题', themeStore.theme)
