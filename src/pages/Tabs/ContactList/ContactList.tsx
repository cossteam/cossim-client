import { Link, List, ListGroup, ListItem, NavRight, Navbar, Page } from 'framework7-react'
import { Person2Alt, PersonBadgeMinusFill, PersonBadgePlusFill, Search } from 'framework7-icons/react'
import { $t } from '@/shared'
import useCacheStore from '@/stores/cache'
import { getFriendList } from '@/run'
import useRouterStore from '@/stores/router.ts'
import { useEffect } from 'react'

const ContactList: React.FC<RouterProps> = ({ f7router }) => {
	const cacheStore = useCacheStore()
	const { contactRouter, setContactRouter } = useRouterStore()

	useEffect(() => {
		setContactRouter(f7router)
		console.log('2路由', contactRouter)
	}, [])

	// 刷新
	const onRefresh = async (done: any) => {
		getFriendList()
		done()
	}

	return (
		<Page ptr className="coss_contacts" onPtrRefresh={onRefresh}>
			<Navbar title={$t('联系人')} className="hidden-navbar-bg">
				<NavRight>
					<Link href={'/search/'}>
						<Search className="w-6 h-6" />
					</Link>
				</NavRight>
			</Navbar>

			<List contactsList noChevron dividers outline className="h-full">
				<ListItem link="/apply_list/" badge={cacheStore.applyCount} badgeColor="red">
					<PersonBadgePlusFill slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('新请求')}
					</span>
				</ListItem>
				<ListItem link="/groups/">
					<Person2Alt slot="media" className="text-primary text-2xl" />
					<span slot="title" className="text-color-primary">
						{$t('群聊')}
					</span>
				</ListItem>
				<ListItem link="/black_list/">
					<PersonBadgeMinusFill slot="media" className="text-red-400 text-2xl" />
					<span slot="title" className="text-red-400">
						{$t('黑名单')}
					</span>
				</ListItem>

				{Object.keys(cacheStore.cacheContactsObj).map((groupKey: any) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{cacheStore.cacheContactsObj[groupKey].map((contact: any, index: number) => (
							<ListItem
								key={index}
								footer={contact?.signature}
								popupClose
								link={`/profile/${contact.user_id}/?dialog_id=${contact?.dialog_id}`}
							>
								<span slot="title">
									{contact?.preferences?.remark?.trim() === ''
										? contact?.nickname
										: contact?.preferences?.remark}
								</span>
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
