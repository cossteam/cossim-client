import { usePreviewStore } from '@/stores/preview'
import { Link } from 'framework7-react'
import { useMemo } from 'react'

interface MessageVideoProps {
	item: { [key: string]: any }
}

const MessageVideo: React.FC<MessageVideoProps> = ({ item }) => {
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
				className="max-h-32 overflow-hidden flex justify-center items-center relative"
				onClick={() => previewStore.preview({ url, type: 'video' })}
			>
				<img className="h-full" src={cover}></img>
				{/* <video className="h-full" muted autoPlay loop src={url} /> */}
				<div className="w-full h-full bg-[rgba(0,0,0,.3)]  flex justify-center items-center absolute top-0 left-0">
					<Link className="rotate-90 text-white" iconF7="arrowtriangle_up_circle" />
				</div>
			</div>
		</>
	)
}

export default MessageVideo
