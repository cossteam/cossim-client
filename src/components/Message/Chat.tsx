import type { PrivateChats } from '@/types/db/user-db'
import clsx from 'clsx'
import { Exclamationmark, Gobackward, Checkmark2 } from 'framework7-icons/react'
import { format } from 'timeago.js'
import { useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { isMe, MESSAGE_SEND } from '@/shared'
import ToolEditor from '@/components/Editor/ToolEditor'
import ToolTip from './ToolTip'
import LongPressButton from '@/components/LongPressButton/LongPressButton'

interface ChatProps {
	msg: PrivateChats
	index: number
	onSelect: (...args: any[]) => void
	className?: string
	isSelected?: boolean
}

const Chat: React.FC<ChatProps> = ({ msg, index, onSelect, className, isSelected }) => {
	const tooltipRef = useRef<HTMLDivElement | null>(null)

	const is_self = isMe(msg?.sender_id)

	// useEffect(() => {
	// 	$(`.${className}`) &&
	// 		$(`.${className}`).on('taphold', (e) => {
	// 			console.log('taphold', e, $(`.${className}`))
	// 			const div = document.createElement('div')
	// 			createRoot(div).render(<ToolTip onSelect={onSelect} el={e.target as HTMLElement} />)
	// 			;(e.target as HTMLElement)!.appendChild(div)
	// 		})
	// })

	const createTooltip = () => {
		if (isSelected) return
		const div = document.createElement('div')
		createRoot(div).render(<ToolTip onSelect={onSelect} el={tooltipRef.current!} />)
		tooltipRef.current!.appendChild(div)
	}

	return (
		<div className={clsx('flex animate__animated', is_self ? 'justify-end' : 'justify-start', className)}>
			<div className="flex max-w-[85%]">
				<div
					className={clsx(
						'w-10 h-10 rounded-full overflow-hidden',
						is_self ? 'order-last ml-2' : 'order-first mr-2'
					)}
				>
					<img
						src="https://picsum.photos/200/300"
						alt="avatar"
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
								'rounded-lg relative px-4 py-2 break-all mb-1 select-none',
								// 'after:block after:absolute after:w-0 after:h-0 after:border-[6px] after:top-[15px] after:border-transparent',
								is_self
									? 'bg-primary text-white  after:left-full after:border-l-primary rounded-tr-none '
									: 'bg-bgPrimary after:right-full after:border-r-white rounded-tl-none '
								// className
							)}
							data-id={msg?.msg_id}
							data-index={index}
							ref={tooltipRef}
						>
							{/* {msg?.content} */}
							<ToolEditor
								readonly
								className="select-none"
								defaultValue={msg?.content}
								data-id={msg?.msg_id}
								data-index={index}
							/>
						</div>
					</LongPressButton>
					<div
						className={clsx('flex text-[0.85rem] items-center', is_self ? 'justify-end' : 'justify-start')}
					>
						<span className="text-[0.85rem] mr-1">{format(msg?.created_at, 'zh_CN')}</span>
						{is_self &&
							(msg?.msg_send_state === MESSAGE_SEND.SEND_SUCCESS ? (
								<Checkmark2 className="text-primary" />
							) : msg?.msg_send_state === MESSAGE_SEND.SEND_FAILED ? (
								<Exclamationmark className="text-red-500" />
							) : (
								<Gobackward />
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Chat
