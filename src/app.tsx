import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'

import GlobalLoading from './components/common/global-loading'
import withAuth from './components/common/with-auth'
import './i18n/config'

const App = () => {
    const router = useRoutes(routes)

    return (
        <Suspense fallback={<GlobalLoading />}>
            {router}
            <Toaster />
        </Suspense>
    )
}

export default withAuth(App)
