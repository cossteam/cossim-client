import { CSSProperties, useEffect, useRef } from 'react'

interface VideoBoxProps {
	key: any
	className: string
	style: CSSProperties | undefined
	track: any
	videostyle?: (CSSProperties & { autoplay?: boolean; loop?: boolean; muted?: boolean }) | undefined
	children?: any
	onClick: () => void
}

const VideoBox: React.FC<VideoBoxProps> = (props) => {
	const videoBoxRef = useRef<HTMLDivElement>(null)
	const videoEL = useRef<HTMLVideoElement>()

	useEffect(() => {
		if (!props.track || !videoBoxRef.current) return
		const el: HTMLVideoElement = props.track.attach()
		if (props.videostyle) {
			for (const key in props.videostyle) {
				if (Object.prototype.hasOwnProperty.call(props.videostyle, key)) {
					// @ts-ignore
					el.style[key] = props.videostyle[key]
				}
			}
		}
		videoEL.current = el
		videoBoxRef.current.appendChild(videoEL.current!)
		return () => {
			if (!videoBoxRef.current) return
			videoBoxRef.current.removeChild(videoEL.current!)
		}
	}, [props.track])

	return (
		<div ref={videoBoxRef} {...props}>
			{props.children && <div className="w-full h-full absolute">{props.children}</div>}
		</div>
	)
}

export default VideoBox
