/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { ArrowUpRight, Ellipsis, Trash } from 'framework7-icons/react'
import { Block, Button, Link, List, ListItem, NavRight, Navbar, Page, Subnavbar, f7 } from 'framework7-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAsyncEffect, useClickOutside } from '@reactuses/core'
import {
	FaceSmiling,
	PlusCircle,
	ArrowRightCircleFill,
	MicCircleFill,
	Xmark,
	XmarkCircle
} from 'framework7-icons/react'
import { Keyboard } from '@capacitor/keyboard'
import { useClipboard } from '@reactuses/core'

import './message.scss'
import { useMessageStore } from '@/stores/message'
import {
	$t,
	TOOLTIP_TYPE,
	MESSAGE_TYPE,
	isMe,
	hasImageHtml,
	scroll,
	MessageMore,
	getLatestGroupAnnouncement
} from '@/shared'
import Chat from '@/components/Message/Chat'
import { isWebDevice } from '@/utils'
import clsx from 'clsx'
import { useToast } from '@/hooks/useToast'
import Contact from '@/components/Contact/Contact'
import Emojis from '@/components/Emojis/Emojis'
import GroupService from '@/api/group'

import ToolEditor, { ToolEditorMethods, ReadEditor } from '@/Editor'
import { useStateStore } from '@/stores/state'
import Quill from 'quill'
import ToolBarMore from '@/components/Message/ToolBarMore'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { Delta } from 'quill/core'
import { EmitterSource } from 'quill/core/emitter'
import { debounce } from 'lodash-es'
// import MsgService from '@/api/msg'
// import RelationService from '@/api/relation'

const Message: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const is_group = f7route.query.is_group === 'true'
	const receiver_id = f7route.params.id as string
	const dialog_id = Number(f7route.params.dialog_id as string)
	const dialog_name = f7route.query.dialog_name

	const contentRef = useRef<HTMLDivElement | null>(null)
	const footerRef = useRef<HTMLDivElement | null>(null)

	const { messages, ...msgStore } = useMessageStore()

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
		scroll(contentRef.current!, isScrollEnd() ? true : false)
	}, [messages])

	useEffect(() => {
		const handlerPageSize = () => {
			if (!contentRef.current) return
			isScrollEnd(300) && scroll(contentRef.current!, true)
		}

		const fn = debounce(handlerPageSize, 100)

		window.addEventListener('resize', fn)
		return () => {
			window.removeEventListener('resize', fn)
		}
	})

	return (
		<Page
			noToolbar
			className="coss_message transition-all"
			onPageInit={async () => msgStore.initMessage(is_group, dialog_id, receiver_id)}
			// ref={pageRef}
			// onPageBeforeOut={() => {
			// msgStore.clearMessages()
			// updateChat(true)
			// }}
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
					<List noChevron mediaList className="my-0">
						{messages.map((item, index) => (
							<ListItem
								key={index}
								className="coss_list_item animate__animated"
								data-index={index}
								style={{ zIndex: 1 }}
								// checkbox={isSelect() && !item?.tips_msg_id}
								// onChange={(e) => onSelectChange(e, item)}
							>
								<Chat
									msg={item}
									index={index}
									// onSelect={onSelect}
									// isSelected={isSelect()}
									// reply={item?.reply_id !== 0 ? replyMessage(item.reply_id) : null}
								/>
							</ListItem>
						))}
					</List>
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
