import {
	Button,
	Icon,
	Link,
	List,
	ListGroup,
	ListItem,
	NavLeft,
	NavRight,
	NavTitle,
	Navbar,
	Page,
	Popup,
	Searchbar,
	Subnavbar,
	View
} from 'framework7-react'
import { useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'

import { $t, arrayToGroups } from '@/shared'
import './Contact.scss'
import useCacheStore from '@/stores/cache.ts'

interface ContactProps {
	completed: (list: any) => void
	defaults?: any[]
	opened?: boolean
	setOpened?: (value: boolean) => void
	group?: boolean
}

const Contact: React.FC<ContactProps> = ({ completed, defaults, opened, setOpened }) => {
	const [friends, setFriends] = useState<any>({})

	const isChecked = (item: any, data?: any[]) => (data || defaults!)?.some((v) => v?.dialog_id === item?.dialog_id)

	const updateFriends = async () => {
		const friends = useCacheStore.getState().cacheContacts
		if (friends) setFriends(arrayToGroups(friends))
		setSelects(defaults! || [])
	}

	useAsyncEffect(
		async () => {
			await updateFriends()
		},
		() => {},
		[opened]
	)

	const [selects, setSelects] = useState<any[]>([])
	const onSelect = (item: any) => {
		if (isChecked(item, selects)) {
			setSelects(selects.filter((v) => v?.dialog_id !== item?.dialog_id))
		} else {
			setSelects([...selects, item])
		}
	}

	return (
		<Popup
			className="contact-popup"
			onPopupOpen={async () => await updateFriends()}
			onPopupClosed={() => {
				setFriends([])
				setSelects([])
				setOpened && setOpened(false)
			}}
			opened={opened}
		>
			<View>
				<Page className="bg-bgTertiary">
					<Navbar className="hidden-navbar-bg bg-bgPrimary coss_contact_navbar">
						<NavLeft>
							<Link popupClose>
								<Icon icon="icon-back"></Icon>
							</Link>
						</NavLeft>
						<NavTitle>{$t('选择联系人')}</NavTitle>
						<NavRight>
							<Button popupClose onClick={() => completed(selects)}>
								{$t('完成')}
							</Button>
						</NavRight>

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

					<List strong noChevron dividers contactsList>
						{Object.keys(friends).map((groupKey: any) => (
							<ListGroup key={groupKey}>
								<ListItem groupTitle title={groupKey} />
								{friends[groupKey].map((contact: any, index: number) => (
									<ListItem
										key={index}
										title={contact?.nickname}
										checkbox
										// @ts-ignore
										checkboxIcon="end"
										onChange={() => onSelect(contact)}
										defaultChecked={isChecked(contact)}
									>
										<div slot="media" className="w-10 h-10 ">
											<img
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
			</View>
		</Popup>
	)
}

export default Contact
