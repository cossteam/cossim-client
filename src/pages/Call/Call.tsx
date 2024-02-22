import { useEffect, useState } from 'react'
import { Page } from 'framework7-react'

import '@livekit/components-styles'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'

import { PhoneFill } from 'framework7-icons/react'
import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus, getStatusDescription } from '@/shared'
import { Track } from 'livekit-client'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	const { callInfo, status, reject, accept, hangup } = useCallStore()
	const roomReady = status === CallStatus.CALLING && callInfo?.wsInfo

	const [worker, setWorker] = useState<Worker | null>(null)
	useEffect(() => {
		;(async () => {
			console.log('通话状态', getStatusDescription(status), callInfo?.wsInfo)
			if (status === CallStatus.WAITING && callInfo?.wsInfo) {
				// if (!worker) {
				// 	const worker = new Worker(new URL('./worker/timer.ts', import.meta.url))
				// 	worker.postMessage({ duration: 6000 })
				// 	worker.onmessage = () => handlerTimeout()
				// 	setWorker(worker)
				// }
			}
		})()
		return () => {
			if (worker) {
				worker.terminate()
				setWorker(null)
			}
		}
	}, [status, callInfo?.wsInfo])

	return (
		<Page className="bg-bgPrimary flex flex-col justify-center items-center">
			<div className="h-full overflow-y-scroll">
				{roomReady && (
					<LiveKitRoom
						style={{ height: '100%' }}
						token={callInfo.wsInfo.token}
						serverUrl={callInfo.wsInfo.url}
						audio={true}
						video={false}
						// screen={true}
						onError={(e) => {
							console.log(e)
						}}
					>
						<MyVideoConference />
						<RoomAudioRenderer />
						<ControlBar />
					</LiveKitRoom>
				)}
			</div>
			{/* <span className="absolute top-[20%] left-1/2 -translate-x-1/2">{getStatusDescription(status)}</span> */}
			<div className="absolute bottom-10 w-full flex flex-row justify-evenly items-center">
				{status === CallStatus.WAITING && (
					<>
						{/* 拒绝 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-red-500"
							onClick={async () => {
								await reject()
								f7router.back()
							}}
						/>
						{/* 接通 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-green-500"
							onClick={async () => {
								await accept()
							}}
						/>
					</>
				)}
				{[CallStatus.CALLING].includes(status) && (
					// 挂断
					<PhoneFill
						className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-red-500"
						onClick={async () => {
							await hangup()
							f7router.back()
						}}
					/>
				)}
			</div>
		</Page>
	)
}

function MyVideoConference() {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ onlySubscribed: false }
	)
	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100% - var(--lk-control-bar-height))' }}>
			<ParticipantTile />
		</GridLayout>
	)
}

export default Call
