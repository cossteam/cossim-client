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

	// console.log('content', content)

	// const Mexwidth = useMemo(() => (content?.width > content?.height ? content?.width : content?.height), [content])
	// const height = useMemo(() => (content?.width > content?.height ? content?.height : content?.width), [content])

	return (
		<>
			<div
				className={clsx('flex justify-center items-center max-w-[200px] max-h-[220px]', className)}
				onClick={() => previewStore.preview({ url, type: 'image' })}
				// style={{  }}
			>
				<img className="rounded object-cover max-h-[200px]" src={url} />
			</div>
		</>
	)
}

export default MessageImage
