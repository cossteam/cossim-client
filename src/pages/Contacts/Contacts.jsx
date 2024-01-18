import { useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, Icon } from 'framework7-react'
import React from 'react'
import { friendListApi, friendApplyListApi } from '@/api/relation'
import { groupRequestListApi } from '@/api/group'
import { $t } from '@/i18n'
import './Contacts.less'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRelationRequestStore } from '@/stores/relationRequest'

export default function Contacts() {
	/**
	 * 将联系人分组转成数组结构
	 * @param {*} obj
	 * @returns
	 */
	const groupsToArray = (obj) => {
		obj = typeof obj !== 'object' ? {} : obj
		return Object.entries(obj)
			.map(([group, users]) => {
				return users.map((user) => ({ group, ...user }))
			})
			.flat()
	}
	/**
	 * 将联系人数组转成分组结构
	 * @param {*} array
	 * @returns
	 */
	const arrayToGroups = (array) => {
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
	const contacts = arrayToGroups(useLiveQuery(() => WebDB.contacts.toArray()) || [])
	useEffect(() => {
		;(async () => {
			const { code, data } = await friendListApi()
			if (code !== 200) return
			let respData = data || {}
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

	// 获取申请列表
	const { updateFriendResquest, updateGroupResquest } = useRelationRequestStore()
	useEffect(() => {
		friendApplyListApi().then(({ data }) => {
			updateFriendResquest(
				data?.map((i) => ({
					...i,
					// 0 初始状态 1 已同意 2 已拒绝
					status: 0
				})) || []
			)
		})
		groupRequestListApi().then(({ data }) => {
			updateGroupResquest(
				// 群聊申请列表 status 申请状态 (0=申请中, 1=已加入, 2=被拒绝, 3=被封禁)
				data?.map((i) => i) || []
			)
		})
	}, [])

	return (
		<Page className="contacts-page">
			<Navbar title="联系人">
				<Subnavbar>
					<Searchbar searchContainer=".contacts-list" disableButton={false} />
				</Subnavbar>
			</Navbar>
			<List contactsList noChevron dividers>
				<ListItem link="/new_contact/">
					<Icon className="contacts-list-icon" f7="person_badge_plus_fill" slot="media" color="primary" />
					<span slot="title" className="text-color-primary">
						{$t('新请求')}
					</span>
				</ListItem>
				<ListItem link="/groups/">
					<Icon className="contacts-list-icon" f7="person_3_fill" slot="media" color="primary" />
					<span slot="title" className="text-color-primary">
						{$t('群组')}
					</span>
				</ListItem>

				{Object.keys(contacts).map((groupKey) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{contacts[groupKey].map((contact) => (
							<ListItem
								key={contact.nick_name}
								link={`/profile/${contact.user_id}/`}
								title={contact.nick_name}
								footer={contact.signature}
								popupClose
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
