import { usePreviewStore } from '@/stores/preview'
import { PrivateChats } from '@/types/db/user-db'
import { Link } from 'framework7-react'
import { useMemo } from 'react'

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

	const previewStore = usePreviewStore()

	return (
		<>
			<div
				className="max-h-32 overflow-hidden flex justify-center items-center relative"
				onClick={() => previewStore.preview({ url, type: 'video' })}
			>
				<video className="h-full" muted autoPlay loop src={url} />
				<div className="w-full h-full bg-[rgba(0,0,0,.3)]  flex justify-center items-center absolute top-0 left-0">
					<Link className="rotate-90 text-white" iconF7="arrowtriangle_up_circle" />
				</div>
			</div>
		</>
	)
}

export default MessageVideo
