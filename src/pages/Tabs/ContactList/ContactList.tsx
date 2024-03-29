import { Link, List, ListGroup, ListItem, NavRight, Navbar, Page } from 'framework7-react'
import { Person2Alt, PersonBadgePlusFill, Search } from 'framework7-icons/react'

import { $t } from '@/shared'
// import RelationService from '@/api/relation'
// import { getCookie } from '@/utils/cookie'
// import UserStore from '@/db/user'
// import { useEffect, useState } from 'react'
// import { useStateStore } from '@/stores/state'
// import { isEmpty } from 'lodash-es'
// import { useMessageStore } from '@/stores/message'
import useCacheStore from '@/stores/cache'
import { getFriendList } from '@/run'
import useRouterStore from '@/stores/router.ts'
import { useEffect } from 'react'

// const user_id = getCookie(USER_ID) || ''

const ContactList: React.FC<RouterProps> = ({f7router}) => {
	const cacheStore = useCacheStore()

	const { router, setRouter } = useRouterStore()

	useEffect(() => {
		setRouter(f7router)
		console.log('2路由', router)
	}, [])

	// const [contact, setContact] = useState<any[]>([])
	// const { is_contacts_update, updateContacts } = useStateStore()

	// 消息列表
	// const msgStore = useMessageStore()

	// const updateContact = async () => {
	// 	const friends = await UserStore.findAll(UserStore.tables.friends)
	// 	setContact(arrayToGroups(friends))
	// 	return friends
	// }

	// const updateContactInit = async () => {
	// 	// 异步去执行
	// 	const friends = await updateContact()
	// 	const { data } = await RelationService.getFriendListApi({ user_id })

	// 	// 如果没有任何东西，说明没有好友了
	// 	if (isEmpty(data)) return await UserStore.clear(UserStore.tables.friends)

	// 	// 将服务器返回的数据转为本地存储的数据格式
	// 	const newData = groupsToArray(data)

	// 	newData.map(async (item: any) => {
	// 		const friend = friends?.find((v) => v.user_id === item.user_id)
	// 		friend
	// 			? await UserStore.update(UserStore.tables.friends, 'user_id', item.user_id, {
	// 					...friend,
	// 					...item
	// 				})
	// 			: await UserStore.add(UserStore.tables.friends, { ...item })
	// 	})
	// }

	// const onPageTabShow = async () => {
	// 	try {
	// 		await updateContactInit()
	// 	} catch (error) {
	// 		console.error('获取好友列表出错', error)
	// 	} finally {
	// 		await updateContact()
	// 	}
	// }

	// 刷新
	const onRefresh = async (done: any) => {
		// await onPageTabShow()
		getFriendList()
		done()
	}

	// useEffect(() => {
	// 	if (is_contacts_update) {
	// 		updateContactInit()
	// 		updateContacts(false)
	// 	}
	// }, [is_contacts_update])

	return (
		<Page
			ptr
			className="coss_contacts bg-gray-200"
			// onPageTabShow={onPageTabShow}
			onPtrRefresh={onRefresh}
			// onPageInit={onPageTabShow}
		>
			<Navbar title={$t('联系人')} className="hidden-navbar-bg bg-bgPrimary">
				<NavRight>
					<Link href={'/search/'}>
						<Search className="w-6 h-6" />
					</Link>
				</NavRight>
				{/* <Subnavbar inner={false}>
					<Searchbar
						searchContainer=".contacts-list"
						placeholder={$t('搜索联系人')}
						searchIn=".item-title"
						outline={false}
						disableButtonText={$t('取消')}
					/>
				</Subnavbar> */}
			</Navbar>

			<List contactsList noChevron dividers outline className="h-full bg-bgPrimary">
				<ListItem link="/apply_list/" badge={cacheStore.applyCount} badgeColor="red">
					<PersonBadgePlusFill slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('新请求')}
					</span>
				</ListItem>
				{/* <ListItem link="/apply_list/" badge={applyTotal} badgeColor="red"> */}
				<ListItem link="/groups/">
					<Person2Alt slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('群聊')}
					</span>
				</ListItem>
				{/* <ListItem>
					<PersonBadgeMinusFill slot="media" className="text-red-400 text-2xl" />
					<span slot="title" className="text-red-400">
						{$t('黑名单')}
					</span>
				</ListItem> */}

				{Object.keys(cacheStore.cacheContactsObj).map((groupKey: any) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{cacheStore.cacheContactsObj[groupKey].map((contact: any, index: number) => (
							<ListItem
								key={index}
								footer={contact?.signature}
								popupClose
								link={`/profile/${contact.user_id}/?dialog_id=${contact?.dialog_id}`}
								// onClick={async () => {
								// await msgStore.initMessage(
								// 	contact?.group_id ? true : false,
								// 	contact?.dialog_id,
								// 	contact?.user_id ?? contact?.group_id
								// )
								// f7router.navigate(`/profile/${contact.user_id}/`)
								// }}
							>
								<span slot="title">{contact?.nickname}</span>
								<div slot="media" className="w-10 h-10 ">
									<img
										className="w-full h-full object-cover rounded-full bg-black bg-opacity-10"
										src={contact?.avatar}
										alt=""
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
