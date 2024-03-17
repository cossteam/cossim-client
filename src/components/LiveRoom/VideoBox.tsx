import { useEffect, useRef } from 'react'

const VideoBox: React.FC<any> = (props: any) => {
	const videoBoxRef = useRef<HTMLDivElement>(null)
	const videoEL = useRef<HTMLVideoElement>()

	useEffect(() => {
		if (!props.track || !videoBoxRef.current) return
		const el = props.track.attach()
		el.style.maxWidth = 'none'
		el.style.height = '100%'
		el.style.transform = 'scaleX(-1)'
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
			<div className="w-full h-full relative">{props.children && props.children}</div>
		</div>
	)
}

export default VideoBox
