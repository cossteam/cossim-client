import React from 'react'
import {
	f7,
	List,
	ListItem,
	Navbar,
	Link,
	Page,
	SwipeoutActions,
	SwipeoutButton,
	Icon,
	Popover
} from 'framework7-react'
import './Chats.less'
import { useUserStore } from '@/stores/user'
import { useChatsStore } from '@/stores/chats'
import { useContactsStore } from '@/stores/contacts'
import DoubleTickIcon from '@/components/DoubleTickIcon'

import { Search, Plus, Person2Alt, PersonBadgePlusFill } from 'framework7-icons/react'
import { $t } from '@/i18n'
// import SearchComponent from '@/components/Search/Search'

export default function Chats() {
	// const { f7router } = props
	const { user } = useUserStore()
	const { contacts } = useContactsStore()
	const { chats } = useChatsStore()

	const swipeoutUnread = () => {
		f7.dialog.alert('Unread')
	}
	const swipeoutPin = () => {
		f7.dialog.alert('Pin')
	}
	const swipeoutMore = () => {
		f7.dialog.alert('More')
	}
	// const swipeoutArchive = () => {
	// 	f7.dialog.alert('Archive')
	// }
	// const onUserSelect = (user) => {
	// 	console.log('start new chat with', user)
	// 	setTimeout(() => {
	// 		f7router.navigate(`/chats/${user.id}/`)
	// 	}, 300)
	// }

	const chatsFormatted = chats
		.filter((chat) => user.user_id !== chat.userId) // remove self
		.map((chat) => {
			const contact = contacts.filter((contact) => contact.id === chat.userId)[0]
			const lastMessage = chat.messages[chat.messages.length - 1]
			return {
				...chat,
				lastMessageText: lastMessage.text,
				lastMessageDate: Intl.DateTimeFormat('en', {
					month: 'short',
					year: 'numeric',
					day: 'numeric'
				}).format(lastMessage.date),
				lastMessageType: lastMessage.type,
				contact
			}
		})

	return (
		<Page className="chats-page">
			<Navbar title="COSS" className="coss-header">
				<Link slot="right" popoverOpen=".popover-menu">
					<Search className="w-[24px] h-[24px]" />
				</Link>
				<Link slot="right" popoverOpen=".popover-menu">
					<Plus className="w-[28px] h-[28px] mr-2" />
				</Link>
			</Navbar>

			<List noChevron dividers mediaList className="chats-list">
				{chatsFormatted.map((chat) => (
					<ListItem
						key={chat.userId}
						link={`/chats/${chat.userId}/`}
						title={chat.contact.name}
						after={chat.lastMessageDate}
						swipeout
					>
						<img
							slot="media"
							src={`/avatars/${chat.contact.avatar}`}
							loading="lazy"
							alt={chat.contact.name}
						/>
						<span slot="text">
							{chat.lastMessageType === 'sent' && <DoubleTickIcon />}
							{chat.lastMessageText}
						</span>
						{/* <SwipeoutActions left>
							<SwipeoutButton close overswipe color="blue" onClick={swipeoutUnread}>
								<Icon f7="chat_bubble_fill" />
								<span>Unread</span>
							</SwipeoutButton>
							<SwipeoutButton close color="gray" onClick={swipeoutPin}>
								<Icon f7="pin_fill" />
								<span>Pin</span>
							</SwipeoutButton>
						</SwipeoutActions> */}
						<SwipeoutActions right>
							<SwipeoutButton close overswipe color="blue" onClick={swipeoutUnread}>
								<Icon f7="chat_bubble_fill" />
								<span>Unread</span>
							</SwipeoutButton>
							<SwipeoutButton close color="gray" onClick={swipeoutPin}>
								<Icon f7="pin_fill" />
								<span>Pin</span>
							</SwipeoutButton>
							<SwipeoutButton close color="gray" onClick={swipeoutMore}>
								<Icon f7="ellipsis" />
								<span>删除</span>
							</SwipeoutButton>
						</SwipeoutActions>
					</ListItem>
				))}
			</List>

			{/* 标题栏右侧加号弹出层 */}
			<Popover className="popover-menu w-[160px]" backdrop={false} arrow={false}>
				<List className="text-white" dividersIos outlineIos strongIos>
					<ListItem link="/dialog/" popoverClose className="el-list">
						<Person2Alt className="el-list__icon" />
						<span className="el-text">{$t('发起群聊')}</span>
					</ListItem>
					<ListItem link="/add_friend/" popoverClose className="el-list">
						<PersonBadgePlusFill className="el-list__icon" />
						<span className="el-text">{$t('添加朋友/群')}</span>
					</ListItem>
				</List>
			</Popover>

			{/* <SearchComponent title={$t('添加朋友')} placeholder={$t('邮箱')} className="z-[13000]" /> */}
		</Page>
	)
}
