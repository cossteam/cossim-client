/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { Navbar, Page } from 'framework7-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import './message.scss'
import { useMessageStore } from '@/stores/message'
import { scroll } from '@/shared'
import { useStateStore } from '@/stores/state'
import { debounce } from 'lodash-es'
import MessageItem from '@/components/ChatMessage/MessageItem'

const Message: React.FC<RouterProps> = ({ f7route }) => {
	const is_group = f7route.query.is_group === 'true'
	const receiver_id = f7route.params.id as string
	const dialog_id = Number(f7route.params.dialog_id as string)
	const dialog_name = f7route.query.dialog_name

	const contentRef = useRef<HTMLDivElement | null>(null)
	const footerRef = useRef<HTMLDivElement | null>(null)

	const { messages, ...msgStore } = useMessageStore()
	const { updateChat } = useStateStore()

	const [isScroll, setIsScroll] = useState<boolean>(false)

	/**
	 * 当前距离距离是否在允许范围内
	 *
	 * @param setp 允许距离底部范围
	 */
	const isScrollEnd = useCallback((setp: number = 200) => {
		if (!contentRef.current) return false
		const scrollTop = contentRef.current!.scrollTop
		const offsetHeight = contentRef.current!.offsetHeight
		const scrollHeight = contentRef.current!.scrollHeight
		return scrollTop + offsetHeight >= scrollHeight - setp
	}, [])

	useEffect(() => {
		if (!messages.length) return
		// requestAnimationFrame(() => {
		// 	scroll(contentRef.current!, isScrollEnd() ? true : false)
		// })
	}, [messages])

	const [newPageSize, setNewPageSize] = useState<number>(0)
	const [oldPageSize, setOldPageSize] = useState<number>(0)
	// 键盘是否弹出
	const [keyboardShow, setKeyboardShow] = useState<boolean>(false)
	useEffect(() => {
		const pageSize = document.documentElement.clientHeight
		setOldPageSize(pageSize)

		const handlerPageSize = () => {
			if (!contentRef.current) return
			isScrollEnd(300) && scroll(contentRef.current!, true)
			setNewPageSize(contentRef.current!.scrollHeight)
		}

		const fn = debounce(handlerPageSize, 100)

		window.addEventListener('resize', fn)
		return () => {
			window.removeEventListener('resize', fn)
		}
	}, [])

	useEffect(() => {
		const keyboardShow = newPageSize - oldPageSize > 0
		setKeyboardShow(keyboardShow)
	}, [newPageSize])

	const onPageBeforeIn = useCallback(async () => {
		msgStore.initMessage(is_group, dialog_id, receiver_id)
	}, [])

	return (
		<Page
			noToolbar
			className="coss_message transition-all"
			// onPageInit={onPageInit}
			onPageBeforeOut={async () => {
				msgStore.clearMessages()
				updateChat(true)
			}}
			onPageBeforeIn={onPageBeforeIn}
			onPageAfterIn={() => {
				scroll(contentRef.current!, false)
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
					className="min-h-16 bg-bgPrimary relative z-[999999] transition-all duration-300 ease-linear"
					ref={footerRef}
				>
					{/* <input type="text" className="border bg-black" /> */}
					<div className="w-full h-full">
						<input type="text" className="!border !border-black !border-solid" />
					</div>
				</div>
			</div>

			{/* <Contact completed={setSelect} opened={showSelect} setOpened={setShowSelect} group /> */}
		</Page>
	)
}

export default Message

