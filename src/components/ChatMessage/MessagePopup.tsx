import { Link, NavRight, Navbar, Page, Subnavbar } from 'framework7-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './css/MessagePopup.scss'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAsyncEffect, useWindowSize } from '@reactuses/core'
import { useMessageStore } from '@/stores/message'
import { useStateStore } from '@/stores/state'
import { useTooltipsStore } from '@/stores/tooltips'
import GroupService from '@/api/group'
import { $t, TOOLTIP_TYPE, USER_ID, getLatestGroupAnnouncement, scroll } from '@/shared'
import { getCookie } from '@/utils/cookie'
import { PluginListenerHandle } from '@capacitor/core'
import { App } from '@capacitor/app'
import { BellFill, ChevronRight, Ellipsis } from 'framework7-icons/react'
import MessageItem from './MessageItem'
import MessageBar from './MessageBar'
import Contact from '../Contact/Contact'

interface MessagePopupProps {
	opened: boolean
}

const user_id = getCookie(USER_ID) ?? ''

const MessagePopup: React.FC<MessagePopupProps> = () => {
	const { width } = useWindowSize()
	const msgStore = useMessageStore()

	const [opacity, setOpacity] = useState<boolean>(false)
	const contentRef = useRef<HTMLDivElement | null>(null)
	const { updateChat } = useStateStore()
	const tooltipStore = useTooltipsStore()
	// 群公告
	const [groupAnnouncement, setGroupAnnouncement] = useState<any>(null)
	// 群成员
	const [members, setMembers] = useState<any[]>([])

	// 是否是系统通知
	const is_system = useMemo(() => msgStore.receiver_id === '10001', [msgStore.receiver_id])

	const isScrollEnd = useCallback((setp: number = 200) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - setp
	}, [])

	// 获取群公告
	const getGroupAnnouncement = () => {
		const params = { group_id: Number(msgStore.receiver_id) }
		GroupService.groupAnnouncementApi(params).then((res) => {
			setGroupAnnouncement(getLatestGroupAnnouncement(res.data ?? []))
		})
	}

	// 获取群聊人员
	useEffect(() => {
		if (msgStore.is_group) {
			GroupService.groupMemberApi({ group_id: Number(msgStore.receiver_id) }).then((res) => {
				setMembers(res.data)
			})
		}
	}, [])

	const isReadGroupAnnouncement = useCallback((users: any[]) => users?.some((v) => v?.user_id === user_id), [])
	const isShowGroupAnnouncement = useMemo(
		() => msgStore.is_group && groupAnnouncement && !isReadGroupAnnouncement(groupAnnouncement?.read_user_list),
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

	const [showOpacity, setShowOpacity] = useState<boolean>(false)
	useEffect(() => {
		if (!msgStore.messages.length || showOpacity) return
		if (msgStore.opened) {
			setOpacity(true)
			setShowOpacity(true)
		}
	}, [msgStore.messages])

	useAsyncEffect(
		async () => {
			if (!msgStore.opened) return
			console.log('获取群公告', msgStore.is_group, msgStore.receiver_id)
			msgStore.is_group && getGroupAnnouncement()
		},
		() => {},
		[msgStore.opened]
	)

	// 进来的动画结束时需要做的操作
	const handleAnimationComplete = () => {
		// 滚动到最后
		requestAnimationFrame(() => {
			// 是否在最底部了
			!isScrollEnd(300) && scroll(contentRef.current!)
		})
	}

	return (
		<motion.div
			animate={{ opacity: msgStore.opened || opacity ? 1 : 0, x: msgStore.opened ? 0 : width }}
			transition={{ duration: 0.2, ease: 'easeIn' }}
			className={clsx('message-popup', { 'message-popup-opacity': opacity })}
			onAnimationComplete={handleAnimationComplete}
		>
			<Page noToolbar className="coss_message transition-all relative">
				<div className="h-screen overflow-hidden flex flex-col">
					<div className="min-h-12 bg-bgPrimary">
						<Navbar
							title="1111"
							subtitle="[在线]"
							backLink
							outline={false}
							className="coss_message_navbar"
							onClickBack={() => msgStore.updateOpened(false)}
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
												msgStore.is_group
													? `/group_info/${msgStore.receiver_id}/`
													: `/profile/${msgStore.receiver_id}/?from_page=message&dialog_id=${msgStore.dialog_id}`
											}
											onClick={() => {
												msgStore.updateOpened(false)
											}}
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
										href={`/create_group_notice/${msgStore.receiver_id}/?id=${groupAnnouncement.id}&admin=${members.find((v) => v?.identity === user_id)?.identity === 2}}`}
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

					<div className={clsx('flex-1 overflow-y-auto overflow-x-hidden')} ref={contentRef}>
						<MessageItem dialog_id={msgStore.dialog_id} el={contentRef} isScrollEnd={isScrollEnd} />
					</div>

					<MessageBar
						contentEl={contentRef}
						isScrollEnd={isScrollEnd}
						receiver_id={msgStore.receiver_id}
						is_group={msgStore.is_group}
						is_system={is_system}
						// f7router={f7router}
						members={members}
					/>

					<Contact
						completed={tooltipStore.updateSelectMember}
						opened={tooltipStore.showSelectMember}
						setOpened={tooltipStore.updateShowSelectMember}
						group
					/>
				</div>
			</Page>
		</motion.div>
	)
}

export default MessagePopup
