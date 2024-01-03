import Chats from '@/pages/Chats/Chats'
import Contacts from '@/pages/Contacts/Contacts'
import My from '@/pages/My/My'
import Messages from '@/pages/Messages/Messages'
import Profile from '@/pages/Profile/Profile'
import NotFoundPage from '@/pages/NotFound'

import Auth from '@/pages/Auth/Auth'

var routes = [
	{
		path: '/chats/',
		component: Chats
	},
	{
		path: '/contacts/',
		component: Contacts
	},
	{
		path: '/my',
		component: My
	},
	{
		path: '/auth/',
		component: Auth
	},
	// {
	// 	path: '/register/',
	// 	asyncComponent: () => import('@/pages/Auth/Register/Register')
	// },
	{
		path: '/chats/:id/',
		component: Messages
	},
	{
		path: '/profile/:id/',
		component: Profile
	},
	{
		path: '(.*)',
		component: NotFoundPage
	}
]

export default routes
