import { Suspense } from 'react'
import { Loading } from '@/ui/loading'
import { Toaster } from 'react-hot-toast'
import withAuth from './components/with-auth'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'

// t2

const App = () => {
    const router = useRoutes(routes)
    return (
        <Suspense fallback={<Loading />}>
            {router}
            <Toaster />
        </Suspense>
    )
}

export default withAuth(App)
