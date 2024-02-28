import { useEffect, useState } from 'react'
import { Button, Page, f7 } from 'framework7-react'
import { PhoneFill } from 'framework7-icons/react'
import '@livekit/components-styles'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import './Call.scss'
import { useCallStore } from '@/stores/call'
import { CallStatus, USER_ID, getStatusDescription } from '@/shared'
import { MessageEventEnum } from './enums'
import localNotification, { LocalNotificationType } from '@/utils/notification'
import { getCookie } from '@/utils/cookie'

const Call: React.FC<RouterProps> = (props) => {
	const { enablesVideo, callInfo, status, reject, accept, hangup } = useCallStore()
	const user_id = getCookie(USER_ID) || ''
	const roomReady = status === CallStatus.CALLING && callInfo?.wsInfo

	// 页面离开时关闭Worker
	const closeWorker = () => {
		worker?.postMessage({
			event: MessageEventEnum.TIMER_STOP,
			data: null
		})
		if (worker) {
			worker.terminate()
			setWorker(null)
		}
	}

	const [worker, setWorker] = useState<Worker | null>(null)
	// 等待时间
	// const [waittingTimer, setWaitTimer] = useState(10 * 60 * 60) // 时 分 秒
	const [waittingTimer, setWaitTimer] = useState(60) // 时 分 秒
	useEffect(() => {
		;(async () => {
			if (
				status === CallStatus.WAITING &&
				user_id !== (callInfo?.userInfo?.user_id || callInfo?.groupInfo?.user_id)
			) {
				if (!worker) {
					const worker = new Worker(new URL('./worker/timer.ts', import.meta.url))
					worker.postMessage({
						event: MessageEventEnum.TIMER_START,
						data: { duration: waittingTimer * 1000 }
					})
					worker.onmessage = (message) => {
						// console.log('收到Worker回复', message.data)
						const { event, data } = message.data
						switch (event) {
							case MessageEventEnum.TIMEOUT:
								localNotification(LocalNotificationType.CALL, '未接来电', '您有未接来电待处理！')
								reject()
								f7.dialog.close()
								break
							case MessageEventEnum.TIMER_CHANGE:
								setWaitTimer(data.remainder)
								break
						}
					}
					setWorker(worker)
				}
			}
			if (status === CallStatus.CALLING && !callInfo?.wsInfo) {
				f7.dialog.alert('通话信息异常，请重新发起通话！', () => {
					hangup()
					closeWorker()
					f7.dialog.close()
				})
			}
			if (status === CallStatus.IDLE) {
				console.log('空闲')
				closeWorker()
				props.f7router.back()
			}
			if (status === CallStatus.HANGUP) {
				console.log('挂断')
				closeWorker()
			}
		})()
		return () => {
			closeWorker()
		}
	}, [status, callInfo?.wsInfo])

	const [errCount, setErrCount] = useState(0)
	const onConnected = () => {
		console.log('通话连接成功')
		getStatusDescription(status)
		setErrCount(0)
	}
	const roomDisconnect = () => {
		console.log('通话断开')
		getStatusDescription(status)
		errCount >= 3 && hangup()
	}

	const roomError = (err: any) => {
		setErrCount(errCount + 1)
		console.log('通话出现异常：', getStatusDescription(status), err)
		status === CallStatus.WAITING && reject()
	}
	// 拒绝
	const onRefuse = async () => {
		await reject()
		closeWorker()
	}
	// 接通
	const onConnect = async () => {
		await accept()
		closeWorker()
	}
	// 挂断
	const onHangup = async () => {
		await hangup()
		closeWorker()
	}

	return (
		<Page
			className="bg-bgPrimary bg-zinc-900 z-[999] flex flex-col justify-center items-center"
			noNavbar
			noToolbar
			onPageBeforeOut={closeWorker}
		>
			{roomReady && (
				<LiveKitRoom
					data-lk-theme="default"
					token={callInfo.wsInfo.token}
					serverUrl={callInfo.wsInfo.url}
					audio={true}
					video={enablesVideo}
					screen={false}
					onConnected={onConnected}
					onDisconnected={roomDisconnect}
					onError={roomError}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<MyControlBar errCount={errCount} hangup={onHangup} />
				</LiveKitRoom>
			)}
			<div className="absolute bottom-10 w-full flex flex-col justify-evenly items-center">
				{status !== CallStatus.CALLING && (
					<div className="text-white fixed top-1/2">
						{status === CallStatus.WAITING && <div className="">等待时间：{waittingTimer}s</div>}
						<div className="">{getStatusDescription(status)}</div>
					</div>
				)}
				{status === CallStatus.WAITING && (
					<div className="w-full flex flex-row justify-evenly items-center">
						{/* 拒绝 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-red-500"
							onClick={onRefuse}
						/>
						{/* 接通 */}
						<PhoneFill
							className="size-[45px] box-content p-2 rounded-full bg-gray-100 text-green-500"
							onClick={onConnect}
						/>
					</div>
				)}
			</div>
		</Page>
	)
}

function MyVideoConference() {
	// const { enablesVideo } = useCallStore()
	// console.log('MyVideoConference', enablesVideo)

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

interface MyControlBarProps {
	errCount: number
	hangup: () => Promise<void>
}

function MyControlBar(props: MyControlBarProps) {
	const { updateHideCall } = useCallStore()
	return (
		<>
			<ControlBar />
			{props.errCount > 0 && (
				<div className="p-2 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] text-center bg-white text-red-500">
					<div>网络异常,重试中(3/{props.errCount})...</div>
				</div>
			)}
			<div className="px-2 pb-6 flex justify-evenly items-center">
				<Button className="flex-1 mx-2 py-4 px-[14px]" fill onClick={() => updateHideCall(true)}>
					收起
				</Button>
				<Button className="flex-1 mx-2 py-4 px-[14px]" fill color="red" onClick={props.hangup}>
					挂断
				</Button>
			</div>
		</>
	)
}

export default Call
