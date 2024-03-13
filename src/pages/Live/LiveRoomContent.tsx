import clsx from 'clsx'
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
		<div
			id={props.rootNodeId ?? ''}
			className={clsx(
				'w-full h-full relative',
				props.isGroup ? 'grid grid-rows-2 grid-cols-2' : 'overflow-hidden flex justify-center items-center'
			)}
		></div>
	)
}

export default LiveRoomContent
