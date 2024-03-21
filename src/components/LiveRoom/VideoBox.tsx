import { CSSProperties, useEffect, useRef } from 'react'

interface VideoBoxProps {
	key: any
	className: string
	style: CSSProperties | undefined
	track: any
	videoStyle?: CSSProperties | undefined
	children?: any
	onClick: () => void
}

const VideoBox: React.FC<VideoBoxProps> = (props) => {
	const videoBoxRef = useRef<HTMLDivElement>(null)
	const videoEL = useRef<HTMLVideoElement>()

	useEffect(() => {
		if (!props.track || !videoBoxRef.current) return
		const el = props.track.attach()
		el.style.maxWidth = 'none'
		el.style.height = '100%'
		el.style.transform = 'scaleX(-1)'
		if (props.videoStyle) {
			console.log('videoStyle', props.videoStyle)
			// for (const styleItem of props.videoStyle) {
			// 	console.log(styleItem)
			// }
		}
		el.autoplay = true
		el.loop = true
		el.muted = true
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
