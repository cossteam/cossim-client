import React from 'react'
import { f7, List, ListItem, Navbar, Link, Page, Button } from 'framework7-react'
import './My.less'
import ListColorIcon from '../../components/ListColorIcon'
import { useUserStore } from '@/stores/user'

export default function My() {
	const userStore = useUserStore()

	const logout = () => {
		f7.dialog.confirm('退出登录', '确定要退出登录吗？', () => {
			userStore.removeUser()
			window.location.href = '/login'
		})
	}
	return (
		<Page className="settings-page">
			<Navbar title="Settings" large transparent />
			<List strong dividers outline mediaList className="settings-profile-list">
				<ListItem link noChevron title="Vladimir" text="This is my status 🤘">
					<img slot="media" src="/avatars/vladimir-kharlampidi.jpg" alt="" />
					<Link
						slot="root"
						style={{
							position: 'absolute',
							right: '16px',
							top: '16px'
						}}
						iconF7="qrcode"
					/>
				</ListItem>
			</List>
			<List strong dividers outline>
				<ListItem link title="Starred Messages">
					<ListColorIcon color="#FFC601" icon="star_fill" slot="media" />
				</ListItem>
				<ListItem link title="Linked Devices">
					<ListColorIcon color="#09AC9F" icon="device_laptop" slot="media" />
				</ListItem>
			</List>

			<List strong dividers outline>
				<ListItem link title="Account">
					<ListColorIcon color="#007AFF" icon="person_fill" slot="media" />
				</ListItem>
				<ListItem link title="Chats">
					<ListColorIcon color="#4BD763" icon="chat_bubble" slot="media" />
				</ListItem>
				<ListItem link title="Notifications">
					<ListColorIcon color="#FE3C30" icon="app_badge" slot="media" />
				</ListItem>
				<ListItem link title="Storage and Data">
					<ListColorIcon color="#4BD763" icon="arrow_up_arrow_down" slot="media" />
				</ListItem>
			</List>

			<List strong dividers outline>
				<ListItem link title="Help">
					<ListColorIcon color="#007BFD" icon="info" slot="media" />
				</ListItem>
				<ListItem link title="Tell a Friend">
					<ListColorIcon color="#FF2C55" icon="heart_fill" slot="media" />
				</ListItem>
			</List>
			<div>
				<Button className="m-10 p-5" color="red" raised fill round onClick={() => logout()}>
					退出
				</Button>
			</div>
		</Page>
	)
}
