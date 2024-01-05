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
import { contacts, chats } from '@/data'
import DoubleTickIcon from '@/components/DoubleTickIcon'

import { Search } from 'framework7-icons/react'

export default function Chats(props) {
	// const { f7router } = props

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

	const chatsFormatted = chats.map((chat) => {
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
			{/* </Navbar> */}
			<Navbar title="coss" className="coss-header">
				{/* <Link slot="right" className="mr-2"> */}
				{/* <Icon f7="search" slot="right" size="20px" className="mr-3" /> */}
				{/* </Link> */}
				{/* <Link slot="right" className="mr-2"> */}
				<Link slot="right" popoverOpen=".popover-menu">
					<Icon f7="plus" size="28px" className="mr-1" />
				</Link>
				{/* </Link> */}
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
							{/* <SwipeoutButton close overswipe color="light-blue" onClick={swipeoutArchive}>
								<Icon f7="archivebox_fill" />
								<span>删除</span>
							</SwipeoutButton> */}
						</SwipeoutActions>
					</ListItem>
				))}
			</List>

			<Popover className="popover-menu w-36" backdrop={false}>
				<List className="text-white" dividersIos outlineIos strongIos>
					<ListItem link="/dialog/" popoverClose title="Dialog" />
					<ListItem link="/tabs/" popoverClose title="Tabs" />
					<ListItem link="/panel/" popoverClose title="Side Panels" />
					<ListItem link="/list/" popoverClose title="List View" />
					<ListItem link="/inputs/" popoverClose title="Form Inputs" />
				</List>
			</Popover>
		</Page>
	)
}
