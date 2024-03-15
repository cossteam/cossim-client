import { PrivateChats } from '@/types/db/user-db'
import { useMemo } from 'react'

interface MessageAudioProps {
	msg: PrivateChats
}

const MessageImage: React.FC<MessageAudioProps> = ({ msg }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(msg.content)
		} catch (error) {
			return null
		}
	}, [msg.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])

	return (
		<div className="">
			<img className="h-full" src={url} />
		</div>
	)
}

export default MessageImage
