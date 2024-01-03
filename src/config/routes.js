import Chats from '@/pages/Chats/Chats'
import Contacts from '@/pages/Contacts/Contacts'
import My from '@/pages/My/My'
import Login from '@/pages/Auth/Login/Login'
import Register from '@/pages/Auth/Register/Register'
import Messages from '@/pages/Messages/Messages'
import Profile from '@/pages/Profile/Profile'
import NotFoundPage from '@/pages/NotFound'

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
		path: '/login/',
		component: Login
	},
	{
		path: '/register/',
		component: Register
	},
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
