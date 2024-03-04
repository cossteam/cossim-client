import {
	Link,
	Navbar,
	Page,
	NavRight,
	Popover,
	List,
	ListItem,
	SwipeoutActions,
	SwipeoutButton
} from 'framework7-react'
import { Plus, Search, Person2Alt, PersonBadgePlusFill } from 'framework7-icons/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { format } from 'timeago.js'
import { isEqual } from 'lodash-es'
import { $t, MESSAGE_MARK, MESSAGE_READ, MESSAGE_SEND } from '@/shared'
import UserStore from '@/db/user'
import MsgService from '@/api/msg'
import RelationService from '@/api/relation'
import './DialogList.scss'
// import ToolEditor from '@/components/Editor/ToolEditor'
import { ReadEditor } from '@/Editor'
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'
import { useStateStore } from '@/stores/state'
import { useMessageStore } from '@/stores/message'

const getAfterMessage = async () => {
	try {
		const dialogs = await UserStore.findAll(UserStore.tables.dialogs)

		// 参数
		const params = dialogs.map((v) => ({ dialog_id: v.dialog_id, msg_id: v?.last_message?.msg_id }))

		const { code, data } = await MsgService.getBehindMessageApi(params)
		if (code !== 200) return

		const messages = data?.map((item: any) => {
			const dialog_id = Number(item.dialog_id)
			return item?.msg_list?.map((v: any) => ({
				...v,
				dialog_id,
				create_at: v?.send_time,
				is_burn_after_reading: 0,
				is_label: MESSAGE_MARK.NOT_MARK,
				is_read: MESSAGE_READ.NOT_READ,
				msg_send_state: MESSAGE_SEND.SEND_SUCCESS,
				receiver: v?.receiver_info?.user_id || v?.receiver_info?.group_id,
				read_at: 0,
				reply_id: v?.reply_id,
				sender_id: v?.sender_info?.user_id,
				type: v?.msg_type,
				sender_info: v?.sender_info,
				at_all_user: v?.at_all_user || [],
				at_users: v?.at_users || [],
				group_id: v?.group_id,
				uid: uuidv4(),
				is_tips: false
			}))
		})

		if (!messages) return

		// TODO: 更新本地数据
		// messages.map(async (item: any) => {
		// 	const msgs = await UserStore.findOneAllById(UserStore.tables.messages, 'dialog_id', item?.dialog_id)
		// 	const index = msgs?.findIndex((v: any) => v?.msg_id === item?.msg_id) ?? -1
		// 	if (index === -1) {
		// 		await UserStore.add(UserStore.tables.messages, item)
		// 	}
		// })

		// await UserStore.bulkAdd(UserStore.tables.messages, messages.flat())
	} catch (error) {
		console.error(error)
	}
}

const DialogList: React.FC<RouterProps> = ({ f7router }) => {
	const dialogs = useLiveQuery(() => UserStore.findAll(UserStore.tables.dialogs)) || []
	const [chats, setChats] = useState<any[]>(dialogs)

	// 全局状态(消息未读)
	const stateStore = useStateStore()
	const msgStore = useMessageStore()

	// 获取对话列表
	const getDialogList = async () => {
		try {
			// 获取落后的消息
			await getAfterMessage()

			const { code, data } = await MsgService.getDialogApi()
			if (code !== 200) return

			if (data.length !== dialogs.length) {
				await UserStore.clear(UserStore.tables.dialogs)
				await UserStore.bulkAdd(UserStore.tables.dialogs, data)
				return
			}

			let unreadMsgCount = 0 // 统计未读消息数量
			data.forEach(async (item: any) => {
				unreadMsgCount += Number(item.dialog_unread_count) // 统计未读消息数量
				const dialog = await UserStore.findOneById(UserStore.tables.dialogs, 'dialog_id', item.dialog_id)

				if (!dialog) return await UserStore.add(UserStore.tables.dialogs, item)

				if (!isEqual(dialog, item)) {
					await UserStore.update(UserStore.tables.dialogs, 'dialog_id', item.dialog_id, {
						...dialog,
						...item
					})
				}
			})
			stateStore.updateUnread({
				...stateStore.unread,
				msg: unreadMsgCount
			})
		} catch {
			console.log('错误')
		}
	}

	// 刷新
	const onRefresh = async (done: any) => {
		await getDialogList()
		done()
	}

	// 置顶对话
	const topDialog = async (e: any, item: any) => {
		console.log('top', e, item)
		await RelationService.topDialogApi({ dialog_id: item.dialog_id, action: item?.top_at ? 0 : 1 })
		await getDialogList()
	}

	// 删除对话
	const deleteDialog = async (e: any, item: any) => {
		console.log('delete', e, item)
		await RelationService.showDialogApi({ dialog_id: item.dialog_id, action: 0 })
		await getDialogList()
	}

	useEffect(() => {
		if (!dialogs.length) return
		const list = dialogs.map((item) => {
			return {
				...item
			}
		})
		setChats(list.sort((a, b) => b.top_at - a.top_at))
	}, [dialogs])

	useEffect(() => {
		console.log('chatt', chats)
	}, [chats])

	return (
		<Page
			ptr
			className="coss_dialog bg-gray-200"
			onPageTabShow={getDialogList}
			onPageBeforeIn={getDialogList}
			onPtrRefresh={onRefresh}
			noSwipeback={false}
		>
			<Navbar title="COSS" className="hidden-navbar-bg bg-bgPrimary">
				<NavRight>
					<Link>
						<Search className="w-6 h-6" />
					</Link>
					<Link popoverOpen=".popover-menu">
						<Plus className="w-7 h-7" />
					</Link>
				</NavRight>
			</Navbar>

			<Popover className="popover-menu w-[160px] bg-black z-[9999]" backdrop={false} arrow={false}>
				<List className="text-white" dividersIos outlineIos strongIos>
					<ListItem link="/add_group/" popoverClose className="coss_dialog_list">
						<Person2Alt className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('发起群聊')}</span>
					</ListItem>

					<ListItem link="/add_friend/" popoverClose className="coss_dialog_list">
						<PersonBadgePlusFill className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('添加朋友')}</span>
					</ListItem>

					{/* <ListItem link="/camera/" popoverClose className="coss_dialog_list">
						<ViewfinderCircleFill className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('扫一扫')}</span>
					</ListItem> */}
				</List>
			</Popover>

			<List contactsList noChevron mediaList dividers className="h-full bg-bgPrimary">
				{chats.map((item) => {
					console.log(item.last_message)

					return (
						<ListItem
							className={clsx(item.top_at !== 0 && 'bg-bgSecondary')}
							key={item?.dialog_id}
							// link={`/message/${item?.user_id ?? item?.group_id}/${item?.dialog_id}/?is_group=${item?.user_id ? 'false' : 'true'}&dialog_name=${item?.dialog_name}`}
							title={item?.dialog_name}
							badge={item?.dialog_unread_count}
							badgeColor="red"
							swipeout
							after={format(
								item?.last_message?.send_time ? item?.last_message?.send_time : item?.dialog_create_at,
								'zh_CN'
							)}
							link
							onClick={async () => {
								msgStore.initMessage(
									item?.group_id ? true : false,
									item?.dialog_id,
									item?.user_id ?? item?.group_id
								)
								f7router.navigate(
									`/message/${item?.user_id ?? item?.group_id}/${item?.dialog_id}/?is_group=${item?.user_id ? 'false' : 'true'}&dialog_name=${item?.dialog_name}`
								)
							}}
						>
							<img
								slot="media"
								src={`${item?.dialog_avatar}`}
								loading="lazy"
								className="w-12 h-12 rounded-full object-cover bg-black bg-opacity-10"
							/>
							<div slot="text" className="max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap">
								<ReadEditor
									content={
										(item?.group_id ? item?.last_message?.sender_info?.name + ':' : '') +
										item?.last_message?.content
									}
									className="dialog-read-editor"
								/>
							</div>
							<SwipeoutActions right>
								<SwipeoutButton close overswipe color="blue" onClick={(e) => topDialog(e, item)}>
									{$t(item.top_at === 0 ? '置顶' : '取消置顶')}
								</SwipeoutButton>
								<SwipeoutButton close color="red" onClick={(e) => deleteDialog(e, item)}>
									{$t('删除')}
								</SwipeoutButton>
							</SwipeoutActions>
						</ListItem>
					)
				})}
			</List>
		</Page>
	)
}

export default DialogList
