import { useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, ListIndex, Icon } from 'framework7-react'
import React from 'react'
import { friendListApi, friendApplyListApi } from '@/api/relation'
import { $t } from '@/i18n'
import './Contacts.less'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'

export default function Contacts() {
	// const { f7router } = props

	// 申请好友列表
	// const [users, setUsers] = useState([])

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
			// const res = await friendListApi({ user_id: user.user_id })
			const res = await friendListApi()
			if (res.code !== 200) return
			let respData = res.data || {}
			for (const key in respData) {
				if (Object.hasOwnProperty.call(respData, key)) {
					respData[key] = respData[key].map((user) => {
						return {
							...user,
							name: user.nick_name || '',
							avatar: user.avatar || ''
						}
					})
				}
			}
			respData = groupsToArray(respData) // 转换为目标数据结构
			const oldData = (await WebDB.contacts.toArray()) || []
			// 校验新数据和旧数据 => 更新数据 or 插入数据库
			for (let i = 0; i < respData.length; i++) {
				const item = respData[i]
				const oldItem = oldData.find((oldItem) => oldItem.user_id === item.user_id)
				oldItem ? await WebDB.contacts.update(oldItem.id, item) : await WebDB.contacts.add(item)
			}
		})()
	}, [])
	
	useEffect(() => {
		;(async ()=>{
			const res = await friendApplyListApi()
			if (res.code !== 200) return
			console.log("res",res);
		})()
	})

	// 选择用户
	// const handleUserSelect = (user) => {
	// 	console.log(user, props,groups)
	// 	f7.dialog.alert('TODO:个人列表')
	// }

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
				<ListItem link="/new_contact/">
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
								link={`/profile/${contact.user_id}/`}
								// link
								title={contact.nick_name}
								footer={contact.signature}
								popupClose
								// onClick={() => handleUserSelect(contact)}
								data-test={contact.email}
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
