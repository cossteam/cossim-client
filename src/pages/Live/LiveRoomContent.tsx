import './LiveRoomContent.scss'
import { useMemo } from 'react'
// import { useLiveStore } from '@/stores/live'

interface LiveRoomContentProps {
	rootNodeId: string
	isGroup: boolean
}

const LiveRoomContent: React.FC<LiveRoomContentProps> = (props: LiveRoomContentProps) => {
	// 通话状态
	// const liveStore = useLiveStore()

	const bodyWidth = useMemo(() => {
		return document.body.clientWidth
	}, [document.body.clientWidth])

	console.log(bodyWidth)

	return (
		<>
			{props.isGroup ? (
				<div id={props.rootNodeId ?? ''} className="room-content-group"></div>
			) : (
				<div id={props.rootNodeId ?? ''} className="room-content"></div>
			)}
		</>
	)
}

export default LiveRoomContent
