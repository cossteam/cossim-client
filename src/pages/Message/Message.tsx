import { Link, NavRight, Navbar, Page } from 'framework7-react'
import { useCallback, useMemo, useRef } from 'react'
import './message.scss'
import { useMessageStore } from '@/stores/message'
import { $t, TOOLTIP_TYPE } from '@/shared'
import { useStateStore } from '@/stores/state'
import MessageItem from '@/components/ChatMessage/MessageItem'
import MessageBar from '@/components/ChatMessage/MessageBar'
import Contact from '@/components/Contact/Contact'
import { useTooltipsStore } from '@/stores/tooltips'
import { Ellipsis } from 'framework7-icons/react'
// import clsx from 'clsx'

const Message: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const dialog_id = Number(f7route.query.dialog_id)
	const receiver_id = f7route.params.id as string
	const dialog_name = f7route.query.dialog_name
	const is_group = f7route.query.is_group === 'true'
	const contentRef = useRef<HTMLDivElement | null>(null)

	const msgStore = useMessageStore()
	const { updateChat } = useStateStore()
	const { showSelectMember, updateShowSelectMember, updateSelectMember, ...tooltipStore } = useTooltipsStore()

	// 是否是系统通知
	const is_system = useMemo(() => receiver_id === '10001', [receiver_id])

	const isScrollEnd = useCallback((setp: number = 200) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - setp
	}, [])

	// const [bgShow, setBgShow] = useState<boolean>(true)
	// useEffect(() => {
	// 	if (!messages.length) return
	// 	let timer: NodeJS.Timeout | null = null
	// 	requestAnimationFrame(() => {
	// 		// 如果处于当前状态就不需要做滚动
	// 		if ([TOOLTIP_TYPE.DELETE, TOOLTIP_TYPE.EDIT].includes(tooltipStore.type)) {
	// 			return
	// 		}
	// 		if (timer) clearTimeout(timer)
	// 		timer = setTimeout(() => scroll(contentRef.current!, isScrollEnd() ? true : false), 0)
	// 	})
	// }, [messages])

	// const onPageAfterIn = async () => {
	// 	requestAnimationFrame(() => {
	// 		// console.log('onPageAfterIn') 
	// 		setTimeout(() => scroll(contentRef.current!, false), 0)
	// 	})
	// }

	return (
		<Page
			noToolbar
			className="coss_message transition-all relative"
			onPageBeforeRemove={async () => {
				msgStore.clearMessages()
				tooltipStore.clear()
				updateChat(true)
			}}
			// onPageAfterIn={onPageAfterIn}
		>
			{/* <div
				className={clsx(
					'w-full h-screen bg-bgTertiary absolute z-[99] animate__animated animate__fadeIn',
					!bgShow && 'message-bg'
				)}
			></div> */}

			<div className="h-screen overflow-hidden flex flex-col">
				<div className="min-h-12 bg-bgPrimary">
					<Navbar
						title={dialog_name}
						subtitle="[在线]"
						backLink
						outline={false}
						className="coss_message_navbar"
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
					</Navbar>
				</div>

				<div className="flex-1 overflow-y-auto overflow-x-hidden" ref={contentRef}>
					<MessageItem dialog_id={dialog_id} el={contentRef} />
				</div>

				<MessageBar
					contentEl={contentRef}
					isScrollEnd={isScrollEnd}
					receiver_id={receiver_id}
					is_group={is_group}
					is_system={is_system}
					f7router={f7router}
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
