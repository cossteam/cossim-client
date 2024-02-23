import { useEffect, useState } from 'react'
import { Page } from 'framework7-react'

import '@livekit/components-styles'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	StartAudio,
	useTracks
} from '@livekit/components-react'

import { PhoneFill } from 'framework7-icons/react'
import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus, getStatusDescription } from '@/shared'
import { Track } from 'livekit-client'

const Call: React.FC<RouterProps> = () => {
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

	const roomDisconnect = () => {
		console.log('通话断开', getStatusDescription(status))
		hangup()
	}

	const roomError = (err: any) => {
		console.log('通话出现异常：', status, err)
		status === CallStatus.WAITING && reject()
	}

	return (
		<Page className="bg-bgPrimary flex flex-col justify-center items-center">
			{roomReady && (
				<LiveKitRoom
					data-lk-theme="default"
					token={callInfo.wsInfo.token}
					serverUrl={callInfo.wsInfo.url}
					audio={true}
					video={true}
					screen={false}
					onDisconnected={roomDisconnect}
					onError={roomError}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<StartAudio label="单击以允许音频播放" />
					<ControlBar />
				</LiveKitRoom>
			)}
			<div className="absolute bottom-10 w-full flex flex-row justify-evenly items-center">
				{status === CallStatus.WAITING && (
					<>
						{/* 拒绝 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-red-500"
							onClick={reject}
						/>
						{/* 接通 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-green-500"
							onClick={accept}
						/>
					</>
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
