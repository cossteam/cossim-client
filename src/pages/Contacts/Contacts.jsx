import { useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, ListIndex, Icon, f7 } from 'framework7-react'
import React from 'react'
import { friendListApi } from '@/api/relation'
import { useUserStore } from '@/stores/user'
import { $t } from '@/i18n'
import './Contacts.less'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'

export default function Contacts(props) {
	// const { f7router } = props
	const { user } = useUserStore()

	function groupsToArray(obj) {
		obj = typeof obj !== 'object' ? {} : obj
		return Object.entries(obj)
			.map(([group, users]) => {
				return users.map((user) => ({ group, ...user }))
			})
			.flat()
	}
	function arrayToGroups(array) {
		array = !Array.isArray(array) ? [] : array
		return array.reduce((result, user) => {
			const group = user.group
			if (!result[group]) {
				result[group] = []
			}
			result[group].push(user)
			return result
		}, {})
	}

	// 获取好友列表
	const groups = arrayToGroups(useLiveQuery(() => WebDB.contacts.toArray()) || [])
	useEffect(() => {
		;(async () => {
			const res = await friendListApi({ user_id: user.user_id })
			if (res.code !== 200) return
			let groupsData = res.data || {}
			for (const key in groupsData) {
				if (Object.hasOwnProperty.call(groupsData, key)) {
					groupsData[key] = groupsData[key].map((user) => {
						return {
							...user,
							name: user.nick_name || '',
							avatar: user.avatar || 'mark-zuckerberg.jpg'
						}
					})
				}
			}

			// 转换为目标数据结构
			const transformedData = groupsToArray(groupsData)

			// 插入数据到 WebDB.contacts 表中
			WebDB.contacts
				.bulkPut(transformedData)
				.then(() => {
					console.log('联系人插入成功！')
				})
				.catch((error) => {
					console.error('联系人插入失败:', error?.message)
				})
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
								footer={contact.signature}
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
