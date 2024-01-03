import Chats from '@/pages/Chats/Chats'
import Contacts from '@/pages/Contacts/Contacts'
import Mine from '@/pages/Mine/Mine'

import Login from '@/pages/Auth/Login/Login'

const routes = [
	{
		path: '/chats/',
		component: Chats
	},
	{
		path: '/contacts/',
		component: Contacts
	},
	{
		path: '/mine/',
		component: Mine
	},
	{
		path: '/login/',
		component: Login
	},
	{
		path: '/register/',
		asyncComponent: () => import('@/pages/Auth/Register/Register')
	},
	{
		path: '/chats/:id/',
		asyncComponent: () => import('@/pages/Messages/Messages')
	},
	{
		path: '/profile/:id/',
		asyncComponent: () => import('@/pages/Profile/Profile')
	},
	{
		path: '(.*)',
		asyncComponent: () => import('@/pages/NotFound')
	}
]

export default routes
