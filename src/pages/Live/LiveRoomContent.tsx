import clsx from 'clsx'
import './LiveRoomContent.scss'
import { useState } from 'react'
// import { useLiveStore } from '@/stores/live'

interface LiveRoomContentProps {
	rootNodeId: string
	isGroup: boolean
}

const LiveRoomContent: React.FC<LiveRoomContentProps> = (props: LiveRoomContentProps) => {
	// 通话状态
	// const liveStore = useLiveStore()
	const [avctiv, setAvctiv] = useState(-1)

	// const bodyWidth = useMemo(() => {
	// 	return document.body.clientWidth
	// }, [document.body.clientWidth])

	return (
		<>
			{!props.isGroup ? (
				<div
					id={props.rootNodeId ?? ''}
					className="room-content-group w-full h-full grid grid-cols-2 overflow-y-auto relative"
				>
					{Array.from({ length: 10 }).map((_, index) => {
						return (
							<div
								key={index}
								className={clsx('video_box', avctiv === index ? 'avctiv' : '')}
								onClick={() => setAvctiv(avctiv === index ? -1 : index)}
							>
								<video
									src="https://www.w3schools.com/html/movie.mp4"
									autoPlay
									loop
									muted
									playsInline
								></video>
							</div>
						)
					})}
				</div>
			) : (
				<div
					id={props.rootNodeId ?? ''}
					className="room-content w-full h-full flex justify-center items-center"
				>
					{/* <div className={clsx('video_box')}>
						<video src="https://www.w3schools.com/html/movie.mp4" autoPlay loop muted playsInline></video>
					</div>
					<div className={clsx('video_box self_video')}>
						<video src="https://www.w3schools.com/html/movie.mp4" autoPlay loop muted playsInline></video>
					</div> */}
				</div>
			)}
		</>
	)
}

export default LiveRoomContent
