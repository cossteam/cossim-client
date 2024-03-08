import { Link, NavRight, Navbar, Page, Subnavbar } from 'framework7-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './message.scss'
import { useMessageStore } from '@/stores/message'
import { $t, TOOLTIP_TYPE, USER_ID, getLatestGroupAnnouncement } from '@/shared'
import { useStateStore } from '@/stores/state'
import MessageItem from '@/components/ChatMessage/MessageItem'
import MessageBar from '@/components/ChatMessage/MessageBar'
import Contact from '@/components/Contact/Contact'
import { useTooltipsStore } from '@/stores/tooltips'
import { BellFill, ChevronRight, Ellipsis } from 'framework7-icons/react'
import GroupService from '@/api/group'
import { getCookie } from '@/utils/cookie'
import clsx from 'clsx'
import { App } from '@capacitor/app'
import { useAsyncEffect } from '@reactuses/core'
import { PluginListenerHandle } from '@capacitor/core'

const user_id = getCookie(USER_ID) ?? ''

const Message: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const dialog_id = Number(f7route.params.dialog_id)
	const receiver_id = f7route.params.id as string
	const dialog_name = f7route.query.dialog_name
	const is_group = f7route.query.is_group === 'true'
	const contentRef = useRef<HTMLDivElement | null>(null)

	const msgStore = useMessageStore()
	const { updateChat } = useStateStore()
	const { showSelectMember, updateShowSelectMember, updateSelectMember, ...tooltipStore } = useTooltipsStore()
	// 群公告
	const [groupAnnouncement, setGroupAnnouncement] = useState<any>(null)
	// 群成员
	const [members, setMembers] = useState<any[]>([])

	// 是否是系统通知
	const is_system = useMemo(() => receiver_id === '10001', [receiver_id])

	const isScrollEnd = useCallback((setp: number = 200) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - setp
	}, [])

	const getGroupAnnouncement = () => {
		const params = { group_id: Number(receiver_id) }
		GroupService.groupAnnouncementApi(params).then((res) => {
			setGroupAnnouncement(getLatestGroupAnnouncement(res.data ?? []))
		})
	}

	// 获取群聊人员
	useEffect(() => {
		if (is_group) {
			GroupService.groupMemberApi({ group_id: Number(receiver_id) }).then((res) => {
				setMembers(res.data)
			})
		}
	}, [])

	const isReadGroupAnnouncement = useCallback((users: any[]) => users?.some((v) => v?.user_id === user_id), [])
	const isShowGroupAnnouncement = useMemo(
		() => is_group && groupAnnouncement && !isReadGroupAnnouncement(groupAnnouncement?.read_user_list),
		[groupAnnouncement]
	)

	const remove = () => {
		msgStore.clearMessages()
		tooltipStore.clear()
		updateChat(true)
	}

	let backListener: PluginListenerHandle
	useAsyncEffect(
		async () => {
			// 添加返回按钮事件监听
			backListener = await App.addListener('backButton', remove)
		},
		() => {
			// 移除返回按钮事件监听器
			backListener.remove()
		},
		[]
	)

	return (
		<Page
			noToolbar
			className="coss_message transition-all relative"
			onPageBeforeIn={async () => is_group && getGroupAnnouncement()}
		>
			<div className="h-screen overflow-hidden flex flex-col">
				<div className="min-h-12 bg-bgPrimary">
					<Navbar
						title={dialog_name}
						subtitle="[在线]"
						backLink
						outline={false}
						className="coss_message_navbar"
						onClickBack={remove}
					>
						<NavRight>
							{tooltipStore.type === TOOLTIP_TYPE.SELECT ? (
								<Link
									onClick={() => {
										tooltipStore.updateType(TOOLTIP_TYPE.NONE)
										tooltipStore.updateShowSelect(false)
									}}
								>
									{$t('取消')}
								</Link>
							) : (
								!is_system && (
									<Link
										href={
											is_group
												? `/group_info/${receiver_id}/`
												: `/profile/${receiver_id}/?from_page=message&dialog_id=${dialog_id}`
										}
									>
										<Ellipsis className="w-6 h-6 mr-2" />
									</Link>
								)
							)}
						</NavRight>
						{isShowGroupAnnouncement && (
							<Subnavbar className="coss_message_subnavbar animate__animated  animate__faster">
								<Link
									className="w-full h-full flex justify-center items-center rounded bg-bgPrimary"
									href={`/create_group_notice/${receiver_id}/?id=${groupAnnouncement.id}&admin=${members.find((v) => v?.identity === user_id)?.identity === 2}}`}
								>
									<div className="w-full py-3 px-4 relative flex items-center">
										<BellFill className="mr-3 text-orange-400 text-sm" />
										<p className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[86%] text-textSecondary">
											<span className="font-bold">{groupAnnouncement.title}：</span>
											{groupAnnouncement.content}
										</p>
										<div className="absolute right-3">
											<ChevronRight className="text-textTertiary text-sm" />
										</div>
									</div>
								</Link>
							</Subnavbar>
						)}
					</Navbar>
				</div>

				<div
					className={clsx('flex-1 overflow-y-auto overflow-x-hidden', isShowGroupAnnouncement ? 'pt-16' : '')}
					ref={contentRef}
				>
					<MessageItem dialog_id={dialog_id} el={contentRef} isScrollEnd={isScrollEnd} />
				</div>

				<MessageBar
					contentEl={contentRef}
					isScrollEnd={isScrollEnd}
					receiver_id={receiver_id}
					is_group={is_group}
					is_system={is_system}
					f7router={f7router}
					members={members}
				/>
			</div>

			<Contact
				completed={updateSelectMember}
				opened={showSelectMember}
				setOpened={updateShowSelectMember}
				group
			/>
		</Page>
	)
}

export default Message
