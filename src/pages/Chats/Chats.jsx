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
import DoubleTickIcon from '@/components/DoubleTickIcon'
import { Search, Plus, Person2Alt, PersonBadgePlusFill } from 'framework7-icons/react'
import { $t } from '@/i18n'
// import SearchComponent from '@/components/Search/Search'
import WebDB from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { getChatList } from '@/api/msg'
import { useEffect } from 'react'

export default function Chats() {
	// const { f7router } = props
	const contact = useLiveQuery(() => WebDB.contacts.toArray()) || []

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

	// 加载会话列表
	useEffect(() => {
		getChatList().then(({ data }) => {
			/*
            {
                "dialog_id": 1,
                "user_id": "787bb5d3-7e63-43d0-ad4f-4c3e5f31a71c",
                "dialog_type": 0,
                "dialog_name": "feng",
                "dialog_avatar": "",
                "dialog_unread_count": 10,
                "last_message": {
                    "msg_type": 0,
                    "content": "",
                    "sender_id": "",
                    "send_time": 0,
                    "msg_id": 0
                }
            }
            */
			console.log(data)
			data.map((item) => {
				return {
					...item,
					...item.last_message
				}
			})
		})
		// WebDB.chats
		// 	.bulkPut(transformedData)
		// 	.then(() => {
		// 		console.log('联系人插入成功！')
		// 	})
		// 	.catch((error) => {
		// 		console.error('联系人插入失败:', error)
		// 	})
	}, [])
	// 根据联系人表生成会话列表数据
	const chatsFormatted =
		contact?.map((item) => {
			return {
				userId: item.user_id || '',
				messages: item.messages || [],
				lastMessageText: item.lastMessageText || '',
				lastMessageDate: Intl.DateTimeFormat('en', {
					month: 'short',
					year: 'numeric',
					day: 'numeric'
				}).format(new Date(item?.date || new Date())),
				lastMessageType: item.lastMessageType || '',
				contact: {
					...item,
					avatar: 'mark-zuckerberg.jpg'
				}
			}
		}) || []

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
