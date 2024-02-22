import { Page } from 'framework7-react'

// import '@livekit/components-styles'
// import { Room, VideoPresets } from 'livekit-client'

import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus, getStatusDescription } from '@/shared'
// import { useEffect } from 'react'
import { PhoneFill } from 'framework7-icons/react'
import { LiveKitRoom } from '@livekit/components-react'

const Call: React.FC<RouterProps> = ({ f7router }) => {
	const { callInfo, status, reject, accept, hangup } = useCallStore()
	const roomReady = status === CallStatus.CALLING && callInfo?.wsInfo

	// useEffect(() => {
	// 	;(async () => {
	// 		console.log('通话状态', getStatusDescription(status), callInfo?.wsInfo)
	// 		if (status !== CallStatus.CALLING || !callInfo?.wsInfo) return
	// 		// 创建房间
	// 		const room = new Room({
	// 			adaptiveStream: true,
	// 			dynacast: true,
	// 			videoCaptureDefaults: {
	// 				resolution: VideoPresets.h720.resolution
	// 			}
	// 		})
	// 		room.prepareConnection(callInfo.wsInfo.url, callInfo.wsInfo.token)
	// 		// 连接到房间
	// 		await room.connect(callInfo.wsInfo.url, callInfo.wsInfo.token)
	// 		console.log('连接到房间', room.name)
	// 		// 启用摄像头和麦克风
	// 		await room.localParticipant.enableCameraAndMicrophone()
	// 	})()
	// }, [status, callInfo?.wsInfo])

	return (
		<Page className="bg-bgPrimary flex flex-col justify-center items-center">
			<div className="h-full overflow-y-scroll">
				{roomReady && (
					<LiveKitRoom
						token={callInfo.wsInfo.token}
						serverUrl={callInfo.wsInfo.url}
						audio={true}
						video={true}
						connect={true}
					>
						{/* <AudioTrack trackRef={trackRef} /> */}
					</LiveKitRoom>
				)}
				{/* <div className="h-[2000px]">123</div> */}
			</div>
			<span className="absolute top-[20%] left-1/2 -translate-x-1/2">{getStatusDescription(status)}</span>
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

export default Call
