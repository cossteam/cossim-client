import { usePreviewStore } from '@/stores/preview'
import { useMemo } from 'react'

interface MessageImageProps {
	item: { [key: string]: any }
}

const MessageImage: React.FC<MessageImageProps> = ({ item }) => {
	const content = useMemo(() => {
		try {
			return JSON.parse(item.content)
		} catch (error) {
			return null
		}
	}, [item.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])

	const previewStore = usePreviewStore()

	return (
		<>
			<div
				className="max-h-32 overflow-hidden flex justify-center items-center"
				onClick={() => previewStore.preview({ url, type: 'image' })}
			>
				<img className="h-full" src={url} />
			</div>
		</>
	)
}

export default MessageImage
