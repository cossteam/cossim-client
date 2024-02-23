import { useEffect, useState } from 'react'
import { Page, f7 } from 'framework7-react'

import '@livekit/components-styles'
import {
	ControlBar,
	DisconnectButton,
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

const Call: React.FC<RouterProps> = () => {
	const { callInfo, status, handlerTimeout, reject, accept, hangup } = useCallStore()
	const roomReady = status === CallStatus.CALLING && callInfo?.wsInfo

	const [worker, setWorker] = useState<Worker | null>(null)
	useEffect(() => {
		;(async () => {
			console.log('通话状态', getStatusDescription(status), callInfo?.wsInfo)
			if (status === CallStatus.WAITING && callInfo?.wsInfo) {
				if (!worker) {
					const worker = new Worker(new URL('./worker/timer.ts', import.meta.url))
					worker.postMessage({ duration: 3 })
					worker.onmessage = () => {
						f7.dialog.alert('通话已超时，请重新发起通话！', () => {
							handlerTimeout()
							f7.dialog.close()
						})
					}
					setWorker(worker)
				}
			}
			if (status === CallStatus.CALLING && !callInfo?.wsInfo) {
				f7.dialog.alert('通话信息异常，请重新发起通话！', () => {
					hangup()
					f7.dialog.close()
				})
			}
		})()
		return () => {
			if (worker) {
				worker.terminate()
				setWorker(null)
			}
		}
	}, [status, callInfo?.wsInfo])

	const [errCount, setErrCount] = useState(0)
	const roomDisconnect = () => {
		console.log('通话断开', getStatusDescription(status))
		// errCount >= 222 && hangup()
		errCount >= 3 && hangup()
	}

	const roomError = (err: any) => {
		setErrCount(errCount + 1)
		console.log('通话出现异常：', getStatusDescription(status), err)
		status === CallStatus.WAITING && reject()
	}

	return (
		<Page className="bg-bgPrimary bg-zinc-900 z-[999] flex flex-col justify-center items-center">
			{roomReady && (
				<LiveKitRoom
					data-lk-theme="default"
					style={{ height: '100%', backgroundColor: 'black' }}
					token={callInfo.wsInfo.token}
					serverUrl={callInfo.wsInfo.url}
					audio={true}
					video={false}
					screen={false}
					onDisconnected={roomDisconnect}
					onError={roomError}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<ControlBar />
					<div className="p-2 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] text-center bg-white text-red-500">
						<div>网络异常,重试中(3/{errCount})...</div>
					</div>
					<div className="p-2 box-border">
						<DisconnectButton onClick={hangup}>挂断</DisconnectButton>
					</div>
				</LiveKitRoom>
			)}
			<div className="absolute bottom-10 w-full flex flex-row justify-evenly items-center">
				{/* <div className="text-center">等待时间：60s</div> */}
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
