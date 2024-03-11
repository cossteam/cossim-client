import './LiveRoomContent.scss'
// import { useLiveStore } from '@/stores/live'

interface LiveRoomContentProps {
	selfId?: string
	othersId?: string
}

const LiveRoomContent: React.FC<LiveRoomContentProps> = (props: LiveRoomContentProps) => {
	// 通话状态
	// const liveStore = useLiveStore()

	return (
		<div id={props.othersId ?? ''} className="w-full h-full relative flex flex-col justify-center items-center">
			<div id={props.selfId ?? ''} className="w-[40%] rounded-md absolute top-[10%] right-0"></div>
		</div>
	)
}

export default LiveRoomContent
