import './LiveRoomContent.scss'
// import { useLiveStore } from '@/stores/live'

const LiveRoomContent: React.FC<any> = (props: any) => {
	// 通话状态
	// const liveStore = useLiveStore()

	return (
		<div className="w-full h-full flex flex-col justify-center items-center" {...props}>
			<div className="flex flex-col">
				{/* <span>audio: {liveStore.audio ? '开' : '关'}</span>
				<span>video: {liveStore.video ? '开' : '关'}</span> */}
			</div>
		</div>
	)
}

export default LiveRoomContent
