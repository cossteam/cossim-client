import { useEffect, useState } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, Icon } from 'framework7-react'
import React from 'react'
import { friendListApi } from '@/api/relation'
import { $t } from '@/i18n'
import './Contacts.less'
import userService from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useRelationRequestStore } from '@/stores/relationRequest'
import { friendApplyListApi } from '@/api/relation'
import { groupRequestListApi } from '@/api/group'
import { useUserStore } from '@/stores/user'

export default function Contacts(props) {
	const { user } = useUserStore()

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
	const contacts = arrayToGroups(useLiveQuery(() => userService.findAll(userService.TABLES.CONTACTS)) || [])
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
			const oldData = (await userService.findAll(userService.TABLES.CONTACTS)) || []
			// 校验新数据和旧数据 => 更新数据 or 插入数据库
			for (let i = 0; i < respData.length; i++) {
				const item = respData[i]
				const oldItem = oldData.find((oldItem) => oldItem.user_id === item.user_id)
				oldItem
					? await userService.update(userService.TABLES.CONTACTS, oldItem.id, item)
					: await userService.add(userService.TABLES.CONTACTS, item)
			}
		})()
	}, [props])

	const { updateFriendResquest, updateGroupResquest } = useRelationRequestStore() // 获取申请列表
	const [requestNumber, setRequestNumber] = useState(0) // 待处理请求数量
	// 获取申请列表
	const getResquestList = () => {
		return Promise.allSettled([friendApplyListApi(), groupRequestListApi()]).then(
			([
				{
					value: { data: friendResquest }
				},
				{
					value: { data: groupResquest }
				}
			]) => {
				let count = 0
				friendResquest &&
					friendResquest.forEach((item) => {
						if (item.status === 0) count++
					})
				groupResquest &&
					groupResquest.forEach((item) => {
						if (item.status === 0 || (item.status === 4 && user.user_id === item.receiver_info.user_id))
							count++
					})
				setRequestNumber(count)
				updateFriendResquest(friendResquest || [])
				updateGroupResquest(groupResquest || [])
			}
		)
	}
	useEffect(() => {
		getResquestList()
	}, [props])

	return (
		<Page className="contacts-page">
			<Navbar title="联系人">
				<Subnavbar>
					<Searchbar searchContainer=".contacts-list" disableButton={false} />
				</Subnavbar>
			</Navbar>
			<List contactsList noChevron dividers>
				<ListItem link="/new_contact/" badge={requestNumber} badgeColor="red">
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
						{contacts[groupKey].map((contact, index) => (
							<ListItem
								key={index}
								link={`/profile/${contact.user_id}/`}
								title={contact.nickname}
								footer={contact.signature}
								popupClose
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
