import {
	Link,
	Navbar,
	Page,
	NavRight,
	Popover,
	List,
	ListItem,
	SwipeoutActions,
	SwipeoutButton,
	PageContent
} from 'framework7-react'
import { Plus, Person2Alt, PersonBadgePlusFill, ViewfinderCircleFill, Search } from 'framework7-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { $t, customSort, formatDialogListTime, MESSAGE_TYPE } from '@/shared'
import RelationService from '@/api/relation'
import './DialogList.scss'
import ReadEditor from '@/components/ReadEditor/ReadEditor'
import clsx from 'clsx'
import useCacheStore from '@/stores/cache'
import { getRemoteSession } from '@/run'
import useMessageStore from '@/stores/message'
import Avatar from '@/components/Avatar/Avatar.tsx'
import useRouterStore from '@/stores/router.ts'
import useToolbarStore from '@/stores/toolbar.ts'

const DialogList: React.FC<RouterProps> = ({ f7router }) => {
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()
	const { router, setRouter } = useRouterStore()
	const { doubleClick, setDoubleClick } = useToolbarStore()

	useEffect(() => {
		if (doubleClick) {
			const unread = cacheStore.cacheDialogs.find((item) => item?.dialog_unread_count > 0)
			unread && scrollTo(unread.dialog_id)
		}
		setDoubleClick(false)
	}, [doubleClick])

	useEffect(() => {
		setRouter(f7router)
		console.log('1路由', router)
	}, [])

	// console.log(router)
	// 置顶对话
	const topDialog = async (item: any) => {
		await RelationService.topDialogApi({ dialog_id: item?.dialog_id, action: item?.top_at ? 0 : 1 })
		await getRemoteSession()
	}

	// 删除对话
	const deleteDialog = async (e: any, item: any) => {
		console.log('delete', e, item)
		await RelationService.showDialogApi({ dialog_id: item?.dialog_id, action: 0 })
		await getRemoteSession()
	}

	const handlerContent = useCallback((content: string) => {
		const doc = new DOMParser().parseFromString(content, 'text/html')
		const imgs = doc.querySelectorAll('img')

		// 替换图片
		if (imgs.length) {
			const span = document.createElement('span')
			span.textContent = $t('[图片]')
			// 全部替换为 文字
			for (let i = 0; i < imgs.length; i++) {
				imgs[i].replaceWith(span)
			}
			content = doc.body.innerHTML
		}
		return content
	}, [])

	// 刷新
	const onRefresh = async (done: any) => {
		// await getDialogList()
		await getRemoteSession()
		done()
		// setPtrRefresh(true)
	}

	const [ptrRefresh, setPtrRefresh] = useState(true)
	const onDialogListScroll = (e: any) => {
		if (e.target?.scrollTop === 0) {
			setPtrRefresh(true)
			return
		}
		if (ptrRefresh) {
			setPtrRefresh(false)
		}
	}

	const Row = (item: any) => {
		switch (item?.last_message?.msg_type) {
			case MESSAGE_TYPE.IMAGE:
				return '[图片]'
			case MESSAGE_TYPE.VIDEO:
				return '[视频]'
			case MESSAGE_TYPE.FILE:
				return '[文件]'
			case MESSAGE_TYPE.AUDIO:
				return '[语音]'
			default:
				return (
					<ReadEditor
						content={
							(item?.group_id && item?.last_message?.sender_info?.name
								? item?.last_message?.sender_info?.name + ':'
								: '') + handlerContent(item?.last_message?.content ?? '')
						}
						className="dialog-read-editor"
					/>
				)
		}
	}

	function heightToTop(ele: any) {
		//ele为指定跳转到该位置的DOM节点
		const root: HTMLElement = document.body
		let height = 0
		do {
			height += ele.offsetTop
			ele = ele.offsetParent
		} while (ele !== root)
		return height
	}

	function scrollTo(id: string) {
		const el: any = document.getElementById(id)

		const element: any = document.getElementById('dialog-box')

		element.scrollTo({
			top: heightToTop(el) - 50,
			left: 0,
			behavior: 'smooth'
		})
		// el.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
	}

	return (
		<Page
			ptr={ptrRefresh}
			className={clsx('coss_dialog bg-gray-200', !ptrRefresh && 'hide-page-content')}
			onPtrRefresh={onRefresh}
			noSwipeback={false}
		>
			<Navbar title="COSS" className="hidden-navbar-bg bg-bgPrimary">
				<NavRight>
					<Link href={'/search/'}>
						<Search className="w-6 h-6" />
					</Link>
					<Link popoverOpen=".popover-menu">
						<Plus className="w-7 h-7" />
					</Link>
				</NavRight>
			</Navbar>

			{/*加号弹窗*/}
			<Popover className="popover-menu w-[160px] bg-black z-[9999]" backdrop={false} arrow={false}>
				<List className="text-white" dividersIos outlineIos strongIos>
					<ListItem link="/create_group/" popoverClose className="coss_dialog_list">
						<Person2Alt className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('发起群聊')}</span>
					</ListItem>

					<ListItem link="/add_friend/" popoverClose className="coss_dialog_list">
						<PersonBadgePlusFill className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('添加朋友')}</span>
					</ListItem>

					<ListItem link="/scanner/" noChevron popoverClose className="coss_dialog_list">
						<ViewfinderCircleFill className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('扫一扫')}</span>
					</ListItem>
				</List>
			</Popover>
			<PageContent className="p-0 max-h-full h-full">
				<div
					id="dialog-box"
					className="h-full bg-bgPrimary pb-12 overflow-y-auto"
					onScroll={onDialogListScroll}
				>
					<List contactsList noChevron mediaList dividers className="">
						{cacheStore.cacheDialogs.sort(customSort).map((item, index) => {
							// console.log('1111', item)
							// @ts-ignore
							return (
								<ListItem
									id={item?.dialog_id}
									className={clsx(item?.top_at !== 0 && 'bg-bgSecondary')}
									key={item?.dialog_id + `${index}`}
									title={item?.dialog_name}
									badge={item?.dialog_unread_count}
									badgeColor="red"
									swipeout
									after={formatDialogListTime(
										item?.last_message?.send_at
											? item?.last_message?.send_at
											: item?.dialog_create_at
									)}
									link
									onClick={async () => {
										await messageStore.init({
											dialogId: item?.dialog_id ?? 0,
											receiverId: item?.user_id ?? item?.group_id ?? 0,
											isGroup: !!item?.group_id,
											receiverInfo: item
										})
										f7router?.navigate(
											`/message/${item?.user_id ?? item?.group_id}/${item?.dialog_id}/?is_group=${item?.user_id ? 'false' : 'true'}&dialog_name=${item?.dialog_name}`
										)
									}}
								>
									{/*@ts-ignore*/}
									<Avatar slot="media" src={`${item?.dialog_avatar}`} />
									<div
										slot="text"
										className="max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap"
									>
										{Row(item)}
									</div>
									<SwipeoutActions right>
										<SwipeoutButton close overswipe color="blue" onClick={() => topDialog(item)}>
											{$t(item?.top_at === 0 ? '置顶' : '取消置顶')}
										</SwipeoutButton>
										<SwipeoutButton close color="red" onClick={(e) => deleteDialog(e, item)}>
											{$t('删除')}
										</SwipeoutButton>
									</SwipeoutActions>
								</ListItem>
							)
						})}
					</List>
				</div>
			</PageContent>
		</Page>
	)
}

export default DialogList
