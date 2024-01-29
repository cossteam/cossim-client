import Chats from '@/pages/Chats/Chats'
import Contacts from '@/pages/Contacts/Contacts'
import My from '@/pages/My/My'
import Messages from '@/pages/Messages/Messages'
import Profile from '@/pages/Profile/Profile'
import NotFoundPage from '@/pages/NotFound'
import AddFriend from '@/pages/AddFriend/AddFriend'
import AddDetails from '@/pages/AddDetails/AddDetails'
import Auth from '@/pages/Auth/Auth'
import ChatTest from '@/pages/ChatTest'
import UserInfo from '@/pages/UserInfo/Userinfo'
import UpdateUserInfo from '@/pages/UpdateUserInfo/UpdateUserInfo'
import NewContact from '@/pages/NewContact/NewContact'
import GroupList from '@/pages/Group/GroupList/GroupList'
import GroupChat from '@/pages/Group/GroupChat/GroupChat'
import NewGroup from '@/pages/Group/NewGroup/NewGroup'
import Camera from '@/pages/Camera/Camera'
import ChatInfo from '@/pages/Group/ChatInfo/ChatInfo'
import MemberList from '@/pages/Group/ChatInfo/MemberList'

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
		path: '/my/',
		component: My
	},
	{
		path: '/auth/',
		component: Auth
	},
	{
		path: '/add_friend/',
		component: AddFriend
	},
	{
		path: '/chat_test/',
		component: ChatTest
	},
	{
		path: '/new_contact/',
		component: NewContact
	},
	{
		path: '/camera/',
		component: Camera
	},
	{
		path: '/add_details/:id/',
		component: AddDetails
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
		path: '/userinfo/:id/',
		component: UserInfo
	},
	{
		path: '/updateuserinfo/:key/',
		component: UpdateUserInfo
	},
	{
		path: '/new_group/',
		component: NewGroup
	},
	{
		path: '/groups/',
		component: GroupList
	},
	{
		path: '/groups/:id/',
		component: GroupChat
	},
	{
		path: '/chatinfo/:type/:id/',
		component: ChatInfo
	},
	{
		path: '/memberlist/:type/:id/',
		component: MemberList
	},
	{
		path: '(.*)',
		component: NotFoundPage
	}
]

export default routes
