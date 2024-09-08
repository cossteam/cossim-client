import { Suspense } from 'react'
import Loading from '@/components/loading'
import { Toaster } from 'react-hot-toast'
import Router from './router'
import withAuth from './components/with-auth'

const App = () => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Router />
            </Suspense>
            <Toaster />
        </>
    )
}

export default withAuth(App)
