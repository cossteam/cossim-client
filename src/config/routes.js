import Chats from '@/pages/Chats/Chats'

const routes = [
    {
        path: '/chats/',
        component: Chats
    },
    {
        path: '/chats/:id/',
        asyncComponent: () => import('@/pages/Messages/Messages2')
    },
    {
        path: '(.*)',
        asyncComponent: () => import('@/pages/NotFound')
    }
]

export default routes
