import React, { useState, useEffect } from 'react'
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
import { dbService } from '@/db'
import { getChatList } from '@/api/msg'
import _ from 'lodash-es'
import { useLiveQuery } from 'dexie-react-hooks'

// import { preKeyGlobal } from '@/state/state'
import { getSession } from '@/utils/session'
import { useUserStore } from '@/stores/user'
import { decryptMessage, importKey } from '@/utils/signal/signal-crypto'
import { format } from 'timeago.js'
import WebSocketClient from '@/utils/WebSocketClient'

export default function Chats(props) {
	// const { f7router } = props

	const { user } = useUserStore()

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

	/**
	 * 页面初始化时加载会话列表
	 * 1、默认空数据
	 * 2、拉取服务端数据
	 * 3、校验新数据和旧数据 => 更新数据 or 插入数据库
	 */
	const chats = useLiveQuery(() => dbService.findAll(dbService.TABLES.CHATS)) || []
	const [chatList, setChatList] = useState([])

	useEffect(() => {
		const initChats = async () => {
			const res = await getChatList()
			if (res.code !== 200) return
			const list = res?.data || []

			const respData =
				list?.map((item) => {
					// 将 last_message 字段数据提取出来
					return _.mapKeys(
						{
							..._.omit(item, ['last_message']), // 排除 last_message
							...item.last_message // 提取 last_message 数据
						},
						(value, key) => {
							if (key === 'content') return 'last_message' // 将 content 改为 last_message
							return key
						}
					)
				}) || []

			for (let i = 0; i < respData.length; i++) {
				const item = respData[i]
				const chatsData = await dbService.findOneById(dbService.TABLES.CHATS, item?.dialog_id, 'dialog_id')
				chatsData
					? await dbService.update(dbService.TABLES.CHATS, item?.dialog_id, item, 'dialog_id')
					: await dbService.add(dbService.TABLES.CHATS, item)
			}
		}

		initChats()
	}, [props])

	// 解密消息
	useEffect(() => {
		const decrypt = async (data) => {
			let chatList = (await dbService.findAll(dbService.TABLES.CHATS)) || []
			console.log('chatList', chatList, data)
			if (chatList.length === 0) return

			let userSession = null,
				preKey = null

			if (!data) {
				for (let i = 0; i < chats.length; i++) {
					const item = chatList[i]

					try {
						if (!item.last_message) continue
						userSession = await getSession(user?.user_id, item.user_id)
						preKey = await importKey(userSession?.preKey)
						item.last_message = await decryptMessage(preKey, item.last_message)
					} catch {
						continue
					}
				}
			} else {
				let last_message = ''
				try {
					userSession = await getSession(user?.user_id, data?.receiver_id)
					preKey = await importKey(userSession?.preKey)
					last_message = await decryptMessage(preKey, data?.last_message)
				} catch {
					last_message = data?.last_message
				}
				const index = chatList.findIndex((v) => v.user_id === data?.receiver_id)
				console.log('index', index)
				if (index !== -1) {
					chatList[index] = {
						...chatList,
						last_message
					}
				}
			}
			console.log('chatList', chatList)
			setChatList(chatList)
		}
		decrypt()
		WebSocketClient.addListener('onChats', decrypt)

		return () => {
			WebSocketClient.removeListener('onChats', decrypt)
		}
	}, [])

	// 会话时间格式化
	const chatsTimeFormat = (date) => {
		return format(date, 'zh_CN')
		// return (
		// 	Intl.DateTimeFormat('zh', {
		// 		month: 'short',
		// 		year: 'numeric',
		// 		day: 'numeric'
		// 	}).format(new Date(date)) || '-'
		// )
	}

	const lastMessageHandler = (chat) => {
		console.log(chat)
		let msg = chat.last_message
		if (!chat?.group_id) return msg
		try {
			msg = JSON.parse(chat?.last_message).content
		} catch (error) {
			console.log(error)
		}
		return msg
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
				{chatList.map((chat, index) => (
					<ListItem
						key={chat.dialog_id}
						data-index={index}
						data-id={chat.group_id}
						link={
							chat.dialog_type === 1
								? `/groups/${chat.group_id}/?dialog_id=${chat?.dialog_id || ''}`
								: `/chats/${chat.user_id}/?dialog_id=${chat?.dialog_id || ''}`
						}
						title={chat.dialog_name}
						// badge={chat.dialog_unread_count}
						after={chatsTimeFormat(chat.send_time)}
						swipeout
					>
						<img slot="media" src={`${chat.dialog_avatar}`} loading="lazy" alt={chat.dialog_name} />
						<div slot="text" className="max-w-[60%] overflow-hidden overflow-ellipsis ">
							{chat.send_time === 'sent' && <DoubleTickIcon />}
							{lastMessageHandler(chat)}
						</div>
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
					<ListItem link="/new_group/" popoverClose className="el-list">
						<Person2Alt className="el-list__icon" />
						<span className="el-text">{$t('发起群聊')}</span>
					</ListItem>
					<ListItem link="/add_friend/" popoverClose className="el-list">
						<PersonBadgePlusFill className="el-list__icon" />
						<span className="el-text">{$t('添加朋友')}</span>
					</ListItem>
				</List>
			</Popover>
		</Page>
	)
}
