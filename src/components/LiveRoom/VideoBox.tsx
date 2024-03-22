import { LocalTrack, RemoteTrack } from 'livekit-client'
import { CSSProperties, useEffect, useRef } from 'react'
import { VideoStyle } from './types'

interface VideoBoxProps {
	key: any
	className: string
	style: CSSProperties | undefined
	track: LocalTrack | RemoteTrack
	videostyle?: VideoStyle
	children?: any
	onClick: () => void
}

const VideoBox: React.FC<VideoBoxProps> = (props) => {
	const videoBoxRef = useRef<HTMLDivElement>(null)
	const videoEL = useRef<HTMLMediaElement>()

	useEffect(() => {
		if (!props.track || !videoBoxRef.current) return
		const el: HTMLMediaElement = props.track.attach()
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
			{props.children && props.children}
		</div>
	)
}

export default VideoBox
