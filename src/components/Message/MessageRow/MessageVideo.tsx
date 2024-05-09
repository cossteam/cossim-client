import { usePreviewStore } from '@/stores/preview'
import clsx from 'clsx'
import { Link } from 'framework7-react'
import { useMemo } from 'react'

interface MessageVideoProps {
	className?: string
	item: { [key: string]: any }
}

const MessageVideo: React.FC<MessageVideoProps> = ({ className, item }) => {
	const content = useMemo(() => {
		try {
			const _content = JSON.parse(item.content)
			return _content
		} catch (error) {
			return null
		}
	}, [item.content])

	const url = useMemo(() => content?.url ?? '', [content?.url])
	const cover = useMemo(() => content?.cover ?? '', [content?.cover])

	const previewStore = usePreviewStore()

	return (
		<>
			<div
				className={clsx(
					'h-48 overflow-hidden flex justify-center items-center relative ',
					className,
					'bg-transparent'
				)}
				onClick={() => previewStore.preview({ url, type: 'video' })}
			>
				<img className="h-full object-cover rounded" src={cover} />
				<div className="w-full h-full  flex justify-center items-center absolute top-0 left-0">
					<Link className="rotate-90 text-white" iconF7="arrowtriangle_up_circle" />
				</div>
			</div>
		</>
	)
}

export default MessageVideo
