import React from 'react'
import { f7, Page, Navbar, NavTitle, List, ListItem, Button } from 'framework7-react'
import PropType from 'prop-types'
import './UserInfo.less'
import { useUserStore } from '@/stores/user'
import { useState } from 'react'
import { useEffect } from 'react'

Userinfo.propTypes = {
	f7router: PropType.object.isRequired
}
export default function Userinfo({ f7router }) {
	const userStore = useUserStore()
	const [user, setUser] = useState(userStore.user)
	useEffect(() => {
		setUser(userStore.user)
	}, [userStore.user])

	const logout = () => {
		f7.dialog.confirm('退出登录', '确定要退出登录吗？', () => {
			userStore.removeUser()
			f7router.navigate('/auth/')
		})
	}

	return (
		<Page className="userinfo-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-16">个人信息</div>
				</NavTitle>
			</Navbar>
			<List strong dividers outline>
				<ListItem link title="头像" noChevron>
					<div slot="after">
						<img className="w-16 h-16 rounded-full" src={user.avatar} alt="" />
					</div>
				</ListItem>
				<ListItem link={`/updateuserinfo/${'nickname'}/?title=${encodeURIComponent('昵称')}`} title="昵称">
					<div slot="after">{user?.nick_name}</div>
				</ListItem>
				<ListItem link title="状态" noChevron>
					<div slot="after">{user?.status}</div>
				</ListItem>
				<ListItem
					link={`/updateuserinfo/${'signature'}/?title=${encodeURIComponent('个性签名')}`}
					title="个性签名"
				>
					<div slot="after">{user?.signature}</div>
				</ListItem>
				<ListItem link={`/updateuserinfo/${'tel'}/?title=${encodeURIComponent('手机号')}`} title="手机号">
					<div slot="after">{user?.tel}</div>
				</ListItem>
				{/* <ListItem link={`/updateuserinfo/${'email'}/?title=${encodeURIComponent('邮箱')}`} title="邮箱">
					<div slot="after">{user.email}</div>
				</ListItem> */}
				<ListItem link title="邮箱" noChevron>
					<div slot="after">{user?.email}</div>
				</ListItem>
				<ListItem
					link={`/updateuserinfo/${'password'}/?title=${encodeURIComponent('密码')}`}
					title="修改密码"
				/>
				<ListItem link title="更换传输密钥" noChevron />
				<ListItem link title="更换消息密钥" noChevron />
			</List>
			<div>
				<Button className="m-10 p-5" color="red" raised fill round onClick={() => logout()}>
					退出
				</Button>
			</div>
		</Page>
	)
}
