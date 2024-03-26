import { usePreviewStore } from '@/stores/preview'
import clsx from 'clsx'
import { useMemo } from 'react'

interface MessageImageProps {
	className?: string
	item: { [key: string]: any }
}

const MessageImage: React.FC<MessageImageProps> = ({ className, item }) => {
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
				className={clsx('size-48 overflow-hidden flex justify-center items-center', className)}
				onClick={() => previewStore.preview({ url, type: 'image' })}
			>
				<img className="h-full object-cover" src={url} />
			</div>
		</>
	)
}

export default MessageImage
