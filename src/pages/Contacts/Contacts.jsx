import { useEffect } from 'react'
import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar, Icon } from 'framework7-react'
import React from 'react'
import { friendListApi, friendApplyListApi } from '@/api/relation'
import { groupRequestListApi } from '@/api/group'
import { $t } from '@/i18n'
import './Contacts.less'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

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

	// // 获取申请列表
	// const [requestList, setRequestList] = useState({})
	// useEffect(() => {
	// 	;(async () => {
	// 		try {
	// 			const res = await Promise.allSettled([
	// 				friendApplyListApi().then((res) => res.data),
	// 				groupRequestListApi().then((res) => res.data)
	// 			])
	// 			console.log(res)
	// 			console.log(res.map((i) => i.value))
	// 			// setRequestList({
	// 			//     requestList,
	// 			//     ...item.value
	// 			// })
	// 			console.log(requestList)
	// 		} catch (error) {
	// 			console.log(error)
	// 		}
	// 	})()
	// }, [])

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
