import { isMe } from '@/shared'
import { PrivateChats } from '@/types/db/user-db'
import clsx from 'clsx'
import { DotRadiowavesRight } from 'framework7-icons/react'
import { useMemo, useRef } from 'react'

interface MessageAudioProps {
	msg: PrivateChats
}

const MessageAudio: React.FC<MessageAudioProps> = ({ msg }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(msg.content)
		} catch (error) {
			return null
		}
	}, [msg.content])

	const is_self = useMemo(() => isMe(msg?.sender_id), [msg?.sender_id])
	const duration = useMemo(() => content?.duration ?? 1, [content?.duration])
	const url = useMemo(() => content?.url ?? '', [content?.url])

	const width = useMemo(() => {
		return duration > 0 && duration < 10 ? '80px' : duration > 30 ? '100px' : '150px'
	}, [msg?.duration])

	const audioRef = useRef<HTMLAudioElement | null>(null)

	const play = () => {
		audioRef.current?.play()
	}

	return (
		<div
			className={clsx('flex items-center py-1 px-2', is_self ? 'justify-end' : 'justify-start')}
			style={{ width }}
			onClick={play}
		>
			{is_self ? (
				<>
					<span className="mr-1">{duration}"</span>
					<DotRadiowavesRight className="rotate-[-180deg]" />
				</>
			) : (
				<>
					<DotRadiowavesRight className="mr-1" />
					<span className="ml-1">{duration}"</span>
				</>
			)}
			<audio src={url} hidden ref={audioRef} className="w-0 h-0"></audio>
		</div>
	)
}

export default MessageAudio
