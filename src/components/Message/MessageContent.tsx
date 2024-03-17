import { useRef } from 'react'

const MessageContent = () => {
	const contentRef = useRef<HTMLDivElement | null>(null)

	return (
		<div className="overflow-y-auto bg-red-100 flex-1" ref={contentRef}>
			{Array.from({ length: 100 }).map((_, index) => (
				<div key={index}>{index + 1}</div>
			))}
			inp
		</div>
	)
}

export default MessageContent
