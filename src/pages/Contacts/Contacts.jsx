import { useState, useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, ListIndex, Icon, f7 } from 'framework7-react'
import React from 'react'

import { friendListApi } from '@/api/relation'
import { useUserStore } from '@/stores/user'
import { $t } from '@/i18n'

import './Contacts.less'

export default function Contacts(props) {
	// const { f7router } = props

	const [groups, setGroups] = useState({})
	const { user } = useUserStore()

	// 获取好友列表
	useEffect(() => {
		const getFriendList = async () => {
			try {
				const res = await friendListApi({ user_id: user.user_id })
				if (res.code !== 200) return
				setGroups(res.data || {})
			} catch (error) {
				console.log(error)
			}
		}
		getFriendList()
	}, [])

	// 选择用户
	const handleUserSelect = (user) => {
		console.log(user, props)
		f7.dialog.alert('TODO:个人列表')
	}

	return (
		<Page className="contacts-page">
			<Navbar title="联系人">
				{/* <Link slot="right" popupClose>
					Cancel
				</Link> */}
				<Subnavbar>
					<Searchbar searchContainer=".contacts-list" disableButton={false} />
				</Subnavbar>
			</Navbar>
			<ListIndex indexes={Object.keys(groups)} listEl=".contacts-list" />
			<List contactsList noChevron dividers>
				<ListItem link>
					<Icon className="contacts-list-icon" f7="person_3_fill" slot="media" color="primary" />
					<span slot="title" className="text-color-primary">
						{$t('群组')}
					</span>
				</ListItem>
				<ListItem link>
					<Icon className="contacts-list-icon" f7="person_badge_plus_fill" slot="media" color="primary" />
					<span slot="title" className="text-color-primary">
						{$t('新联系人')}
					</span>
				</ListItem>
				{Object.keys(groups).map((groupKey) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{groups[groupKey].map((contact) => (
							<ListItem
								key={contact.nick_name}
								// link={`/profile/${contact.user_id}/`}
								link
								title={contact.nick_name}
								footer={contact.status}
								popupClose
								onClick={() => handleUserSelect(contact)}
							>
								<img slot="media" src={contact.avatar} alt="" />
							</ListItem>
						))}
					</ListGroup>
				))}
			</List>
		</Page>
	)
}
