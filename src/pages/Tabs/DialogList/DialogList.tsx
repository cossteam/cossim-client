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
import { Plus, Person2Alt, PersonBadgePlusFill, ViewfinderCircleFill, Search, Qrcode } from 'framework7-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { $t, customSort, formatDialogListTime, msgType } from '@/shared'
import RelationService from '@/api/relation'
import './DialogList.scss'
import ReadEditor from '@/components/ReadEditor/ReadEditor'
import clsx from 'clsx'
import useCacheStore from '@/stores/cache'
import { getRemoteSession } from '@/run'
import useMessageStore from '@/stores/message'
import Avatar from '@/components/Avatar/Avatar.tsx'
import useToolbarStore from '@/stores/toolbar.ts'
import { elementIsVisible } from '@/utils/utils.ts'

const DialogList: React.FC<RouterProps> = ({ f7router }) => {
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()
	const { doubleClick } = useToolbarStore()
	const [firstUnread, setFirstUnread] = useState<string>()

	useEffect(() => {
		const unread = cacheStore.cacheDialogs?.find((item) => item?.dialog_unread_count > 0)
		if (!unread) return
		unread && scrollTo(unread.dialog_id)
		const unreadElement = document.getElementById(unread?.dialog_id)
		unreadElement &&
			elementIsVisible(unreadElement).then((isVisible) => {
				if (isVisible) {
					setTimeout(() => {
						setFirstUnread(unread?.dialog_id)
					}, 100)
					setTimeout(() => {
						setFirstUnread('0')
					}, 2000)
				}
			})
	}, [doubleClick])

	// 置顶对话
	const topDialog = async (item: any) => {
		await RelationService.topDialogApi({ dialog_id: item?.dialog_id, top: item?.top_at ? false : true })
		await getRemoteSession()
	}

	// 删除对话
	const deleteDialog = async (e: any, item: any) => {
		console.log('delete', e, item)
		await RelationService.showDialogApi({ dialog_id: item?.dialog_id, show: false })
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
		await getRemoteSession()
		done()
	}

	const Row = (item: any) => {
		let text = item?.last_message?.content ?? ''

		const type = item?.last_message?.msg_type

		if (type === msgType.IMAGE) text = '[图片]'
		if (type === msgType.VIDEO) text = '[视频]'
		if (type === msgType.FILE) text = '[文件]'
		if (type === msgType.AUDIO) text = '[语音]'
		if (type === msgType.RECALL) text = '[撤回了一条消息]'

		return (
			<ReadEditor
				content={
					(item?.group_id && item?.last_message?.sender_info?.name
						? item?.last_message?.sender_info?.name + ':'
						: '') + handlerContent(text)
				}
				className="dialog-read-editor"
			/>
		)
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

		// const element: any = document.getElementById('dialog-box')
		const element: any = document.querySelector('.page-content')

		element &&
			element?.scrollTo({
				top: heightToTop(el) - 50,
				left: 0,
				behavior: 'smooth'
			})
		// el.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
	}

	return (
		<Page
			className={clsx('coss_dialog')}
			ptr={true}
			ptrMousewheel={false}
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

					<ListItem link="/my_qrcode/" noChevron popoverClose className="coss_dialog_list">
						<Qrcode className="coss_dialog_list__icon" />
						<span className="coss_dialog_list__text">{$t('我的二维码')}</span>
					</ListItem>
				</List>
			</Popover>

			<List contactsList noChevron mediaList dividers className="pb-[50px]" id="dialog-box">
				{cacheStore.cacheDialogs.sort(customSort).map((item, index) => {
					// @ts-ignore
					return (
						<ListItem
							id={item?.dialog_id}
							className={clsx(
								item?.top_at !== 0 && 'bg-bgSecondary',
								item?.dialog_id == firstUnread && 'animate__animated animate__fadeIn'
							)}
							key={item?.dialog_id + `${index}`}
							title={item?.dialog_name}
							badge={item?.dialog_unread_count}
							badgeColor="red"
							swipeout
							after={formatDialogListTime(
								item?.last_message?.send_at ? item?.last_message?.send_at : item?.dialog_create_at
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
							<div slot="text" className="max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap">
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
		</Page>
	)
}

export default DialogList
