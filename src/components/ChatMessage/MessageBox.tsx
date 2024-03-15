import type { PrivateChats } from '@/types/db/user-db'
import clsx from 'clsx'
import { Exclamationmark, Flag, Gobackward } from 'framework7-icons/react'
import { createElement, RefObject, useCallback, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { $t, formatTime, isMe, formatTimeFull, MESSAGE_SEND, MESSAGE_TYPE, TOOLTIP_TYPE } from '@/shared'
import ToolTip from './MessageToolTips'
import LongPressButton from '@/components/LongPressButton/LongPressButton'
import { ReadEditor } from '@/Editor'
import { useTooltipsStore } from '@/stores/tooltips'
import MessageAudio from './Audio/MessageAudio'
import MessageVideo from './Video/MessageVideo'
import MessageImage from './Image/MessageImage'

interface MessageBoxProps {
	msg: PrivateChats
	index: number
	onSelect: (...args: any[]) => void
	className?: string
	reply?: any
	listItemRef: RefObject<HTMLDivElement | null>
}

const MessageBox: React.FC<MessageBoxProps> = ({ msg, index, onSelect, className, reply, listItemRef }) => {
	const tooltipRef = useRef<HTMLDivElement | null>(null)
	const is_self = isMe(msg?.sender_id)

	const tooltipStore = useTooltipsStore()

	const [messageTime, setMessageTime] = useState<string>(formatTime(msg?.created_at ?? msg?.create_at))

	const selectChange = useCallback((type: TOOLTIP_TYPE, msg_id: number) => onSelect(type, msg_id), [onSelect])

	// 创建工具提示
	const createTooltip = useCallback(() => {
		// 如果当前状态为多选状态，就不给创建工具提示
		if (tooltipStore.type === TOOLTIP_TYPE.SELECT) return
		// 如果没有发生完毕
		if (msg?.msg_send_state === MESSAGE_SEND.SENDING) return
		const div = document.createElement('div')
		const root = createRoot(div)
		root.render(
			createElement(ToolTip, {
				onSelect: selectChange,
				el: tooltipRef.current!,
				is_group: msg.group_id !== 0,
				parentEl: listItemRef
			})
		)
		tooltipRef.current!.appendChild(div)
	}, [])

	const Row = () => {
		switch (msg?.type) {
			case MESSAGE_TYPE.AUDIO:
				return <MessageAudio msg={msg} />
			case MESSAGE_TYPE.VIDEO:
				return <MessageVideo msg={msg} />
			case MESSAGE_TYPE.IMAGE:
				return <MessageImage msg={msg} />
			case MESSAGE_TYPE.FILE:
				return <div className="py-2 px-2 bg-primary">[文件]</div>
			default:
				return (
					<ReadEditor
						content={msg?.content}
						replyContent={reply?.content}
						replyName={reply?.sender_info?.name ?? reply?.sender_info?.nickname ?? ''}
						className={clsx('py-2 px-2', is_self ? 'bg-primary' : 'read-editor-no-slef bg-white')}
					/>
				)
		}
	}

	// 标注信息
	if (msg?.type === MESSAGE_TYPE.LABEL) {
		return (
			<div className="max-w-[70%] w-fit bg-gray-200 px-2 py-[2px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] rounded mx-auto text-center cursor-pointer active:bg-opacity-50">
				{$t(msg?.sender_info?.nickname || msg?.sender_info?.name)}
				&nbsp;
				{msg?.is_label !== 0 ? $t('标注了') : $t('取消标注')}&nbsp;
				{`"${msg?.content}"`}
			</div>
		)
	}

	// 错误信息
	if (msg?.type === MESSAGE_TYPE.ERROR) {
		return (
			<div className="max-w-[70%] w-fit bg-gray-200 px-2 py-[2px] flex items-center text-red-500 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] rounded mx-auto text-center cursor-pointer active:bg-opacity-50">
				{msg?.content}
			</div>
		)
	}

	// 语音
	// if (msg?.type === MESSAGE_TYPE.AUDIO) {
	// 	return <div className="flex max-w-[85%]"></div>
	// }

	/**
	 * 点击时间转换时间格式
	 */
	const handlerClickTime = () => {
		const time: string = formatTime(msg?.created_at ?? msg?.create_at)
		const timeFull: string = formatTimeFull(msg?.created_at ?? msg?.create_at)
		if (messageTime.length < timeFull.length) {
			setMessageTime(timeFull)
		} else {
			setMessageTime(time)
		}
	}

	return (
		<div className={clsx('flex', is_self ? 'justify-end' : 'justify-start', className)} id={`msg_${msg?.msg_id}`}>
			<div className="flex max-w-[85%]">
				<div
					className={clsx(
						'w-10 h-10 rounded-full overflow-hidden',
						is_self ? 'order-last ml-2' : 'order-first mr-2'
					)}
				>
					<img
						src={msg?.sender_info?.avatar}
						alt={msg?.sender_info?.nickname}
						className="w-full h-full rounded-full object-cover"
					/>
				</div>
				<div
					className={clsx(
						'flex flex-col flex-1',
						is_self ? 'order-first items-end' : 'order-last items-start'
					)}
				>
					<div className="mb-1 text-[0.85rem]"></div>

					<LongPressButton callback={() => createTooltip()}>
						<div
							className={clsx(
								'rounded-lg relative break-all mb-1 select-none overflow-hidden',
								is_self
									? 'text-white  after:left-full after:border-l-primary rounded-tr-none '
									: 'bg-bgPrimary after:right-full after:border-r-white rounded-tl-none'
							)}
							data-id={msg?.msg_id}
							data-index={index}
							data-label={msg?.is_label}
							ref={tooltipRef}
						>
							{/* {msg?.type === MESSAGE_TYPE.AUDIO ? (
								<MessageAudio msg={msg} />
							) : (
								<ReadEditor
									content={msg?.content}
									replyContent={reply?.content}
									replyName={reply?.sender_info?.name ?? reply?.sender_info?.nickname ?? ''}
									className={clsx(is_self ? '' : 'read-editor-no-slef')}
								/>
							)} */}
							{Row()}
						</div>
					</LongPressButton>

					{/* 发送状态 */}
					<div
						className={clsx('flex text-[0.85rem] items-center', is_self ? 'justify-end' : 'justify-start')}
					>
						<span onClick={handlerClickTime} style={{ color: '#94a3b8' }} className="text-[0.85rem] mr-1">
							{messageTime}
						</span>
						{is_self && (
							<>
								{msg?.msg_send_state === MESSAGE_SEND.SENDING && (
									<Gobackward className="animate-spin" />
								)}
								{msg?.msg_send_state === MESSAGE_SEND.SEND_FAILED && (
									<Exclamationmark className="text-red-500" />
								)}
							</>
						)}
						{msg?.is_label !== 0 && <Flag className="text-primary ml-[2px]" />}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessageBox
