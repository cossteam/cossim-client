// import './LiveRoomContent.scss'
import { useLiveStore } from '@/stores/live'
// import videoUrl0 from '@/assets/video0.mp4'
// import videoUrl1 from '@/assets/video1.mp4'
// import videoUrl2 from '@/assets/video2.mp4'

const LiveRoomContent: React.FC<any> = (props: any) => {
	// 通话状态
	const liveStore = useLiveStore()

	return (
		<div className="w-full h-full flex flex-col justify-center items-center" {...props}>
			<div className="flex flex-col">
				<span>audio: {liveStore.audio ? '开' : '关'}</span>
				<span>video: {liveStore.video ? '开' : '关'}</span>
			</div>
			<div>
				{liveStore.eventDesc(liveStore.event!)}
				{liveStore.ownEventDesc(liveStore.ownEvent)}
			</div>
		</div>
	)
}

export default LiveRoomContent
