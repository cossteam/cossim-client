import { useState, useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, ListIndex, Icon, f7 } from 'framework7-react'
import React from 'react'
import { friendListApi } from '@/api/relation'
import { useUserStore } from '@/stores/user'
import { $t } from '@/i18n'
import './Contacts.less'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'

console.log(WebDB.contacts)

export default function Contacts(props) {
	// const { f7router } = props

	const allItems = useLiveQuery(() => WebDB.contacts.toArray())
	console.log(allItems)
	const [groups, setGroups] = useState({})
	const { user } = useUserStore()

	// 获取好友列表
	useEffect(() => {
		;(async () => {
			const res = await friendListApi({ user_id: user.user_id })
			if (res.code !== 200) return
			setGroups(res.data || {})
			/*
			// IndexedDB 存储测试
			for (const group in res.data) {
				if (Object.hasOwnProperty.call(res.data, group)) {
					for (let i = 0; i < 20; i++) {
						res.data[group].push({
							user_id: '334f4b6e-d731-4428-98f8-9b624eed6e9f' + i,
							nick_name: 'feng' + i,
							email: '1005@qq.com',
							signature: '',
							status: 1,
							group: 'F',
							id: 1
						})
					}
					res.data[group].forEach((item) => {
						item['group'] = group
					})
					console.log(res.data[group])
					// 将数据插入到 contacts 表中
					WebDB.contacts
						.bulkPut(res.data[group])
						.then(() => {
							console.log('数据存储成功！')
						})
						.catch((error) => {
							console.error('数据存储失败:', error)
						})
				}
			}
            */
		})()
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
