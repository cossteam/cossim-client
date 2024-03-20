import { MESSAGE_SEND, formatTime, formatTimeFull } from '@/shared'
import clsx from 'clsx'
import { Exclamationmark, Flag, Gobackward } from 'framework7-icons/react'
import { useState } from 'react'

interface MessageTimeProps {
	item: any
	is_self: boolean
}

/**
 * 点击时间转换时间格式
 */
const MessageTime: React.FC<MessageTimeProps> = ({ item, is_self }) => {
	const [messageTime, setMessageTime] = useState<string>(formatTime(item?.created_at ?? item?.create_at))
	const handlerClickTime = () => {
		const time: string = formatTime(item?.created_at ?? item?.create_at)
		const timeFull: string = formatTimeFull(item?.created_at ?? item?.create_at)
		if (messageTime.length < timeFull.length) {
			setMessageTime(timeFull)
		} else {
			setMessageTime(time)
		}
	}

	return (
		<div className={clsx('flex text-[0.75rem] items-center mt-1 select-none', is_self ? 'justify-end' : 'justify-start')}>
			<span onClick={handlerClickTime} style={{ color: '#94a3b8' }} className="text-[0.75rem] mr-1">
				{messageTime}
			</span>
			{is_self && (
				<>
					{item?.msg_send_state === MESSAGE_SEND.SENDING && <Gobackward className="animate-spin" />}
					{item?.msg_send_state === MESSAGE_SEND.SEND_FAILED && <Exclamationmark className="text-red-500" />}
				</>
			)}
			{item?.is_label !== 0 && <Flag className="text-primary ml-[2px]" />}
		</div>
	)
}

export default MessageTime
