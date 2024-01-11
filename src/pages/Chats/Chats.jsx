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
import _ from 'lodash-es'

export default function Chats() {
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

	// 加载会话列表
	const chats = useLiveQuery(() => WebDB.chats.toArray()) || []
	useEffect(() => {
		getChatList().then(({ data }) => {
			const newData = data?.map((item) => {
				return _.mapKeys(
					{
						..._.omit(item, ['last_message']),
						...item.last_message
					},
					(value, key) => {
						if (key === 'content') return 'last_message'
						return key
					}
				)
			})
			WebDB.chats
				.bulkPut(newData)
				.then(() => {
					console.log('会话插入成功！')
				})
				.catch((error) => {
					console.error('会话插入失败:', error?.message)
				})
		})
	}, [])

	// 会话时间格式化
	const chatsTimeFormat = (date) => {
		return (
			Intl.DateTimeFormat('en', {
				month: 'short',
				year: 'numeric',
				day: 'numeric'
			}).format(new Date(date)) || '-'
		)
	}

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
				{chats.map((chat) => (
					<ListItem
						key={chat.dialog_id}
						link={`/chats/${chat.user_id}/?dialog_id=${chat?.dialog_id || ''}`}
						title={chat.dialog_name}
						after={chatsTimeFormat(chat.send_time)}
						swipeout
					>
						<img slot="media" src={`${chat.dialog_avatar}`} loading="lazy" alt={chat.dialog_name} />
						<span slot="text">
							{chat.send_time === 'sent' && <DoubleTickIcon />}
							{chat.last_message}
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
