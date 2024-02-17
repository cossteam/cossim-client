import { List, ListGroup, ListItem, Navbar, Page, Searchbar, Subnavbar } from 'framework7-react'
import { Person2Alt, PersonBadgePlusFill, PersonBadgeMinusFill } from 'framework7-icons/react'

import { $t, USER_ID, arrayToGroups } from '@/shared'
import RelationService from '@/api/relation'
import { getCookie } from '@/utils/cookie'
import UserStore from '@/db/user'
import { useState } from 'react'
import GroupService from '@/api/group'

const user_id = getCookie(USER_ID) || ''


const ContactList: React.FC<RouterProps> = ({ f7router }) => {
	const [contact, setContact] = useState<any[]>([])
	const [applyTotal, setApplyTotal] = useState<number>(0)

	const updateContact = async () => {
		const friends = await UserStore.findAll(UserStore.tables.friends)
		setContact(arrayToGroups(friends))
		return friends
	}

	const updateApplyTotal = async () => {
		// 获取申请列表
		const group = await GroupService.groupRequestListApi({ user_id })
		const friend = await RelationService.friendApplyListApi({ user_id })

		const len = [...group.data, ...friend.data].filter(
			(v) => v?.status === 0 && (v?.sender_id || v?.receiver_info?.user_id) !== user_id
		).length
		setApplyTotal(len)
	}

	const onPageTabShow = async () => {
		try {
			// 异步去执行
			updateApplyTotal()

			const friends = await updateContact()
			const { data } = await RelationService.getFriendListApi({ user_id })

			Object.entries(data).forEach(([key, value]) => {
				;(value as any[]).forEach(async (item) => {
					const friend = friends?.find((v) => v.user_id === item.user_id)
					friend
						? await UserStore.update(UserStore.tables.friends, 'user_id', item.user_id, {
								...friend,
								...item
							})
						: await UserStore.add(UserStore.tables.friends, { ...item, group: key })
				})
			})
		} catch (error) {
			console.error('获取好友列表出错', error)
		} finally {
			await updateContact()
		}
	}

	return (
		<Page ptr onPageTabShow={onPageTabShow}>
			<Navbar title={$t('联系人')} className="hidden-navbar-bg">
				<Subnavbar inner={false}>
					<Searchbar
						searchContainer=".contacts-list"
						placeholder={$t('搜索联系人')}
						searchIn=".item-title"
						outline={false}
						disableButtonText={$t('取消')}
					/>
				</Subnavbar>
			</Navbar>

			<List contactsList noChevron dividers>
				<ListItem link="/apply_list/" badge={applyTotal} badgeColor="red">
					<PersonBadgePlusFill slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('新请求')}
					</span>
				</ListItem>
				<ListItem link="/apply_list/" badge={applyTotal} badgeColor="red">
					<Person2Alt slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('群聊')}
					</span>
				</ListItem>
				<ListItem link="/groups/">
					<PersonBadgeMinusFill slot="media" className="text-red-400 text-2xl" />
					<span slot="title" className="text-red-400">
						{$t('黑名单')}
					</span>
				</ListItem>

				{Object.keys(contact).map((groupKey: any) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{contact[groupKey].map((contact: any, index: number) => (
							<ListItem key={index} footer={contact?.signature} popupClose>
								<span slot="title" onClick={() => f7router.navigate(`/profile/${contact.user_id}/`)}>
									{contact?.nickname}
								</span>
								<div slot="media" className="w-10 h-10 ">
									<img
										onClick={() => f7router.navigate(`/profile/${contact.user_id}/`)}
										src={contact?.avatar}
										alt=""
										className="w-full h-full object-cover rounded-full"
									/>
								</div>
							</ListItem>
						))}
					</ListGroup>
				))}
			</List>
		</Page>
	)
}

export default ContactList
