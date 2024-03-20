import { isMe, msgType, tooltipType } from '@/shared'
import clsx from 'clsx'
import { useMemo, useRef } from 'react'

import useMessageStore from '@/stores/new_message'

import { ReadEditor } from '@/Editor'
import MessageImage from './MessageRow/MessageImage'
import MessageAudio from './MessageRow/MessageAudio'
import MessageVideo from './MessageRow/MessageVideo'
import MessageFile from './MessageRow/MessageFile'
import MessageTime from './MessageRow/MessageTime'
import MessageTooltip from './MessageRow/MessageTooltip'
import Tippy from '@tippyjs/react'
import { useClickOutside } from '@reactuses/core'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import 'tippy.js/animations/shift-away-subtle.css'

interface MessageRowProps {
	item: any
}

const className = (is_self: boolean) => {
	return clsx(
		'py-2 px-3 rounded-lg',
		is_self ? 'bg-primary text-white rounded-tr-none text-right' : 'bg-bgPrimary rounded-tl-none text-left'
	)
}

const MessageRow: React.FC<MessageRowProps> = ({ item }) => {
	const longPressRef = useRef<HTMLDivElement>(null)

	const type = useMemo(() => item?.type, [item?.type])
	const is_self = useMemo(
		() => isMe(item?.sender_info?.user_id ?? item?.sender_id),
		[item?.sender_info?.user_id, item?.sender_id]
	)

	const messageStore = useMessageStore()

	// @ts-ignore
	useClickOutside(longPressRef, () => setTimeout(() => longPressRef.current?._tippy?.hide(), 100))

	const render = () => {
		switch (type) {
			case msgType.IMAGE:
				return <MessageImage />
			case msgType.AUDIO:
				return <MessageAudio className={className(is_self)} item={item} />
			case msgType.VIDEO:
				return <MessageVideo />
			case msgType.FILE:
				return <MessageFile />
			default:
				return <ReadEditor content={item?.content} className={className(is_self)} />
		}
	}

	return (
		<>
			<div className={clsx('w-full flex items-start', is_self ? 'justify-end' : 'justify-start')}>
				<div className={clsx('max-w-[80%] flex-1 py-2 flex', is_self ? 'justify-end' : 'justify-start')}>
					<div className={clsx('flex items-start', is_self ? 'justify-end pr-2' : 'justify-start pl-2')}>
						<img
							src={item?.sender_info?.avatar}
							alt="avatar"
							className={clsx('w-10 h-10 rounded-full', is_self ? 'order-last ml-2' : 'order-first mr-2')}
						/>
						<div
							className={clsx(
								'overflow-hidden relative flex flex-col',
								is_self ? 'items-end' : 'items-start'
							)}
						>
							{messageStore.isGroup && (
								<span className="mb-1 text-[0.75rem] text-gray-500">{item?.sender_info?.name}</span>
							)}
							<Tippy
								content={<MessageTooltip item={item} />}
								arrow={true}
								interactive={true}
								appendTo={document.body}
								theme="light"
								animation="shift-away-subtle"
								touch={['hold', 300]}
								ref={longPressRef}
								trigger="manual"
							>
								<div className="relative">{render()}</div>
							</Tippy>

							<MessageTime item={item} is_self={is_self} />
						</div>
					</div>
				</div>

				{/* 多选时触发 */}
				{messageStore.tipType === tooltipType.SELECT && (
					<div className={clsx('flex justify-start order-first pt-5 pl-3', is_self ? 'flex-1' : '')}>
						<input type="checkbox" />
					</div>
				)}
			</div>
		</>
	)
}

export default MessageRow
