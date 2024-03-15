import { PrivateChats } from '@/types/db/user-db'
import { useEffect, useMemo } from 'react'

interface MessageAudioProps {
	msg: PrivateChats
}

const MessageVideo: React.FC<MessageAudioProps> = ({ msg }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(msg.content)
		} catch (error) {
			return null
		}
	}, [msg.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])

	useEffect(() => {
		console.log(content?.url)
	}, [content])

	return (
		<div className="">
			<video className="h-full" muted autoPlay loop src={url} />
		</div>
	)
}

export default MessageVideo
