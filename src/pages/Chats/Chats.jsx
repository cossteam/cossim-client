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
import userService, { dbService } from '@/db'
import { getChatList, getBehindMsgApi } from '@/api/msg'
import { mapKeys, omit } from 'lodash-es'
import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'timeago.js'
import { decryptMessage } from '@/utils/tweetnacl'
import { useHistoryStore } from '@/stores/history'
import { useUserStore } from '@/stores/user'

export default function Chats(props) {
	const swipeoutUnread = () => {
		f7.dialog.alert('Unread')
	}
	const swipeoutPin = () => {
		f7.dialog.alert('Pin')
	}
	const swipeoutMore = () => {
		f7.dialog.alert('More')
	}

	const historyStore = useHistoryStore()

	const { user } = useUserStore()

	/**
	 * 页面初始化时加载会话列表
	 * 1、默认空数据
	 * 2、拉取服务端数据
	 * 3、校验新数据和旧数据 => 更新数据 or 插入数据库
	 */
	const chats = useLiveQuery(() => dbService.findAll(dbService.TABLES.CHATS)) || []
	const [chatList, setChatList] = useState([])
	// 是否是首次进入
	const [isFirstIn, setIsFirstIn] = useState(true)

	useEffect(() => {
		try {
			const initChats = async () => {
				const res = await getChatList()
				if (res.code !== 200) return
				const list = res?.data || []

				const respData =
					list?.map((item) => {
						// 将 last_message 字段数据提取出来
						return mapKeys(
							{
								...omit(item, ['last_message']), // 排除 last_message
								...item.last_message // 提取 last_message 数据
							},
							(_, key) => {
								if (key === 'content') return 'last_message' // 将 content 改为 last_message
								return key
							}
						)
					}) || []

				for (let i = 0; i < respData.length; i++) {
					const item = respData[i]
					const chatsData = await dbService.findOneById(dbService.TABLES.CHATS, item?.dialog_id, 'dialog_id')

					// 对比最新会话，始终保持和服务器的最新消息和本地的最新消息是一致的
					if (isFirstIn && item.send_time === chatsData?.send_time) {
						historyStore.updateIds(item.user_id)
					}

					chatsData
						? await dbService.update(dbService.TABLES.CHATS, item?.dialog_id, item, 'dialog_id')
						: await dbService.add(dbService.TABLES.CHATS, item)
				}

				setIsFirstIn(false)
			}

			initChats()
		} catch (error) {
			console.error(error)
		}
	}, [props])

	// 解密消息
	useEffect(() => {
		const decrypt = async () => {
			let chatList = (await dbService.findAll(dbService.TABLES.CHATS)) || []
			if (chatList.length === 0) return
			for (let i = 0; i < chats.length; i++) {
				const item = chatList[i]
				try {
					if (!item.last_message) continue
					const session = await userService.findOneById(userService.TABLES.USERS, item.user_id)
					const msgJSON = JSON.parse(item.last_message)
					item.last_message = decryptMessage(msgJSON.msg, msgJSON.nonce, session?.data?.shareKey)
				} catch {
					continue
				}
			}
			setChatList(chatList)
		}
		console.log('chats 发生改变', chats)
		decrypt()
	}, [chats])

	useEffect(() => {
		const getBehindMsg = async () => {
			const chats = await userService.findAll(userService.TABLES.CHATS)
			if (!chats) return
			const data = chats.map((v) => ({ dialog_id: v.dialog_id, msg_id: v.msg_id }))
			const res = await getBehindMsgApi(data)
			if (res.code !== 200) return

			console.log('res', res)

			const list = res?.data || []
			if (list.length === 0) return

			const msgs = await userService.findAll(userService.TABLES.USERS)
			list.map((v) => {
				const msg = msgs?.find((msg) => msg.dialog_id === v.dialog_id)

				let newMsg = null

				console.log("msg", msg,msgs)

				v?.msg_list?.map(async (s) => {
					newMsg = {
						...s,
						content_type: s?.msg_type,
						created_at: s?.send_time,
						send_state: 'ok',
						type: s.sender_id === user.user_id ? 'sent' : 'received',
						is_read: false
					}

					if (msg) {
						await userService.update(userService.TABLES.MSGS, msg.user_id, {
							user_id: msg.user_id,
							msgs: [...msg.msgs, newMsg]
						})
					} else {
						await userService.add(userService.TABLES.MSGS, {
							user_id: v?.sender_id,
							msgs: [newMsg]
						})
					}
				})
			})
		}

		getBehindMsg()
	}, [])

	const lastMessageHandler = (chat) => {
		let msg = chat.last_message
		if (!chat?.group_id) return msg
		try {
			msg = JSON.parse(chat?.last_message).content
		} catch {
			msg = '该消息解密失败'
			// console.log(error)
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
						after={format(chat.send_time, 'zh_CN')}
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
