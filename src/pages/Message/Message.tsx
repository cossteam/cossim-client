import { Navbar, Page } from 'framework7-react'
import { useCallback, useEffect, useRef } from 'react'
import './message.scss'
import { useMessageStore } from '@/stores/message'
import { scroll } from '@/shared'
import { useStateStore } from '@/stores/state'
// import { debounce } from 'lodash-es'
import MessageItem from '@/components/ChatMessage/MessageItem'
import MessageBar from '@/components/ChatMessage/MessageBar'

const Message: React.FC<RouterProps> = ({ f7route }) => {
	// const is_group = f7route.query.is_group === 'true'
	// const receiver_id = f7route.params.id as string
	// const dialog_id = Number(f7route.params.dialog_id as string)
	const dialog_name = f7route.query.dialog_name

	const contentRef = useRef<HTMLDivElement | null>(null)
	const footerRef = useRef<HTMLDivElement | null>(null)

	const { messages, ...msgStore } = useMessageStore()
	const { updateChat } = useStateStore()

	const isScrollEnd = useCallback((setp: number = 200) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - setp
	}, [])

	useEffect(() => {
		if (!messages.length) return
		requestAnimationFrame(() => {
			setTimeout(() => scroll(contentRef.current!, isScrollEnd() ? true : false), 0)
		})
	}, [messages])

	return (
		<Page
			noToolbar
			className="coss_message transition-all"
			onPageBeforeOut={async () => {
				msgStore.clearMessages()
				updateChat(true)
			}}
		>
			<div className="h-screen overflow-hidden flex flex-col">
				<div className="min-h-12 bg-bgPrimary">
					<Navbar
						title={dialog_name}
						subtitle="[在线]"
						backLink
						outline={false}
						className="coss_message_navbar"
					></Navbar>
				</div>

				<div className="flex-1 overflow-y-auto overflow-x-hidden" ref={contentRef}>
					<MessageItem />
				</div>

				<div
					className="bg-bgPrimary relative z-[999999] transition-all duration-300 ease-linear"
					ref={footerRef}
				>
					<div className="w-full h-full">
						<MessageBar contentEl={contentRef} isScrollEnd={isScrollEnd} />
					</div>
				</div>
			</div>

			{/* <Contact completed={setSelect} opened={showSelect} setOpened={setShowSelect} group /> */}
		</Page>
	)
}

export default Message
