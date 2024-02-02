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
import { PhoneFill } from 'framework7-icons/react'
import { liveUserApi } from '@/api/live'
import PropType from 'prop-types'
import { useLiveStore } from '@/stores/live'
import { f7 } from 'framework7-react'

Contacts.propTypes = {
	f7router: PropType.object.isRequired
}

export default function Contacts(props) {
	const { user } = useUserStore()

	// /**
	//  * 将联系人分组转成数组结构
	//  * @param {*} obj
	//  * @returns
	//  */
	// const groupsToArray = (obj) => {
	// 	obj = typeof obj !== 'object' ? {} : obj
	// 	return Object.entries(obj)
	// 		.map(([group, users]) => {
	// 			return users.map((user) => ({ group, ...user }))
	// 		})
	// 		.flat()
	// }

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
	// const contacts = arrayToGroups(useLiveQuery(() => userService.findAll(userService.TABLES.CONTACTS)) || [])

	// 好友列表
	const friends = arrayToGroups(useLiveQuery(() => userService.findAll(userService.TABLES.FRIENDS_LIST)) || [])

	useEffect(() => {
		;(async () => {
			const { code, data } = await friendListApi()
			if (code !== 200) return
			let respData = data || {}

			const oldData = (await userService.findAll(userService.TABLES.FRIENDS_LIST)) || []

			for (const key in respData) {
				// respData[key] = respData[key].map((user) => {
				// 	return {
				// 		...user,
				// 		name: user.nick_name || '',
				// 		avatar: user.avatar || ''
				// 	}
				// })
				respData[key].forEach(async (user) => {
					const oldItem = oldData.find((oldItem) => oldItem.user_id === user.user_id)
					console.log(oldItem)
					oldItem
						? await userService.update(userService.TABLES.FRIENDS_LIST, oldItem.id, {
								...oldItem,
								...user,
								group: key
							})
						: await userService.add(userService.TABLES.FRIENDS_LIST, { ...user, group: key })
				})
			}
			// respData = groupsToArray(respData) // 转换为目标数据结构
			// const oldData = (await userService.findAll(userService.TABLES.CONTACTS)) || []
			// // 校验新数据和旧数据 => 更新数据 or 插入数据库
			// for (let i = 0; i < respData.length; i++) {
			// 	const item = respData[i]
			// 	const oldItem = oldData.find((oldItem) => oldItem.user_id === item.user_id)
			// 	oldItem
			// 		? await userService.update(userService.TABLES.CONTACTS, oldItem.id, item)
			// 		: await userService.add(userService.TABLES.CONTACTS, item)
			// }
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

	const liveStore = useLiveStore()
	const callUser = async (contact) => {
		const { code, data, msg } = await liveUserApi({ user_id: contact.user_id })
		code !== 200 && f7.dialog.alert(msg)
		if (code === 200) {
			liveStore.updateLive(data)
			props.f7router.navigate('/call/')
		}
	}

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

				{Object.keys(friends).map((groupKey) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{friends[groupKey].map((contact, index) => (
							<ListItem key={index} footer={contact.signature} popupClose>
								<span
									slot="title"
									onClick={() => props.f7router.navigate(`/profile/${contact.user_id}/`)}
								>
									{contact.nickname}
								</span>
								<img
									slot="media"
									onClick={() => props.f7router.navigate(`/profile/${contact.user_id}/`)}
									src={contact.avatar}
									alt=""
								/>
								<span slot="after" className="text-color-primary" onClick={(e) => e.stopPropagation()}>
									<PhoneFill className="w-[24px] h-[24px]" onClick={() => callUser(contact)} />
								</span>
							</ListItem>
						))}
					</ListGroup>
				))}
			</List>
		</Page>
	)
}
