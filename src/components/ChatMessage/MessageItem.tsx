import { MESSAGE_SEND, TOOLTIP_TYPE, isMe } from '@/shared'
import { useMessageStore } from '@/stores/message'
import clsx from 'clsx'
import { List, ListItem } from 'framework7-react'
import LongPressButton from '@/components/LongPressButton/LongPressButton'
import { ReadEditor } from '@/Editor'
import { format } from 'timeago.js'
import { Exclamationmark, Flag } from 'framework7-icons/react'
import { createElement, useCallback, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import ToolTip from '@/components/Message/ToolTip'
interface MessageItemProps {
    
}

const MessageItem: React.FC<MessageItemProps> = () => {
	const { messages } = useMessageStore()
	const tooltipRefs = useRef<(HTMLDivElement | null)[]>([])

	const createTooltip = useCallback((index: number) => {
		const div = document.createElement('div')
		const root = createRoot(div)
		root.render(
			createElement(ToolTip, {
				onSelect: selectChange,
				el: tooltipRefs.current[index]!,
				is_group: messages[index]?.group_id !== 0
			})
		)
		tooltipRefs.current[index]!.appendChild(div)
	}, [])

	const selectChange = useCallback((type: TOOLTIP_TYPE, msg_id: number) => {
		console.log('selectChange', type, msg_id)
	}, [])

	return (
		<List noChevron mediaList className="my-0">
			{messages.map((msg, index) => {
				const is_self = isMe(msg?.sender_id)
				return (
					<ListItem
						key={index}
						className="coss_list_item animate__animated animate__fadeInUp"
						data-index={index}
						style={{ zIndex: 1 }}
					>
						<div
							className={clsx('flex', is_self ? 'justify-end' : 'justify-start')}
							id={`msg_${msg?.msg_id}`}
						>
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

									<LongPressButton callback={() => createTooltip(index)}>
										<div
											className={clsx(
												'rounded-lg relative py-2 break-all mb-1 select-none',
												is_self
													? 'bg-primary text-white  after:left-full after:border-l-primary rounded-tr-none '
													: 'bg-bgPrimary after:right-full after:border-r-white rounded-tl-none '
											)}
											data-id={msg?.msg_id}
											data-index={index}
											data-label={msg?.is_label}
											ref={(el) => (tooltipRefs.current[index] = el)}
										>
											<ReadEditor
												content={msg?.content}
												// replyContent={reply?.content}
												// replyName={reply?.sender_info?.name ?? reply?.sender_info?.nickname ?? ''}
												className={clsx(is_self ? '' : 'read-editor-no-slef')}
											/>
										</div>
									</LongPressButton>

									{/* 发送状态 */}
									<div
										className={clsx(
											'flex text-[0.85rem] items-center',
											is_self ? 'justify-end' : 'justify-start'
										)}
									>
										<span className="text-[0.85rem] mr-1">{format(msg?.create_at, 'zh_CN')}</span>
										{is_self && (
											<>
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
					</ListItem>
				)
			})}
		</List>
	)
}

export default MessageItem
