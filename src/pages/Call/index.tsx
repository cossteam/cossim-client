import { useNewCallStore } from '@/stores/new_call'
import clsx from 'clsx'
import { Icon, Link, Page, PageContent } from 'framework7-react'
import { useEffect, useState } from 'react'
import { CallStatus } from './enums'
import { CallRoom } from './CallRoom'
import { GridLayout, ParticipantTile, RoomAudioRenderer, useTracks } from '@livekit/components-react'
import { Track } from 'livekit-client'

const Call: React.FC<RouterProps> = () => {
	const [isCallActive, setCallActive] = useState(false)
	const [isGroup, setIsGroup] = useState(false)
	const [audioEnable, setAudioEnable] = useState(true)
	const [videoEnable, setVideoEnable] = useState(false)
	const [frontCamera, setFrontCamera] = useState(true)

	const imgRul = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
	const newCallStore = useNewCallStore()

	// 监听本地状态
	useEffect(() => {
		if (newCallStore.status === CallStatus.CALL && newCallStore.room !== null) {
			setCallActive(true)
		}
		setIsGroup(newCallStore.room?.isGroup ?? false)
		setAudioEnable(newCallStore.room?.option?.audioEnabled ?? false)
		setVideoEnable(newCallStore.room?.option?.videoEnabled ?? false)
	}, [newCallStore.status])

	useEffect(() => {}, [newCallStore.room?.option])

	// const root = useLiveKitRoom()

	// 开启摄像头
	const openCamera = () => {
		setVideoEnable(!videoEnable)
	}
	// 切换摄像头
	const switchCamera = () => {
		setFrontCamera(!frontCamera)
	}
	// 开启麦克风
	const openMike = () => {
		setAudioEnable(!audioEnable)
	}
	// 切换麦克风
	// const switchMike = () => {}

	// 拒绝加入
	const refuseJoinRoom = () => {
		newCallStore.room && newCallStore.refuseJoinRoom(newCallStore.room?.id)
	}

	// 挂断通话
	const leaveRoom = () => {
		newCallStore.room && newCallStore.leaveRoom(newCallStore.room?.id)
	}

	// 加入通话
	const joinRoom = () => {
		newCallStore.room &&
			newCallStore.joinRoom(newCallStore.room?.id, {
				audioEnabled: true
			})
	}

	return (
		<Page noNavbar noToolbar>
			<PageContent className="h-full relative flex flex-col ">
				<CallRoom
					serverUrl={newCallStore.room?.serverUrl}
					token={newCallStore.room?.token}
					audio={true}
					video={true}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
				</CallRoom>
				<div className={clsx('p-2 flex justify-end', isGroup ? 'w-full' : 'fixed top-0 right-0')}>
					<Link
						className=""
						iconF7="arrow_up_right_square"
						iconSize={30}
						popupClose
						onClick={() => newCallStore.updateVisible(false)}
					/>
				</div>
				<div
					className={clsx(
						'w-full relative',
						isGroup
							? 'flex-1 overflow-y-auto grid grid-cols-2 gap-0'
							: ' absolute top-1/4 flex justify-center'
					)}
				>
					{!isGroup ? (
						<div
							className={clsx(
								'bg-[reba(0,0,0,0.75)]',
								isGroup ? 'flex flex-col justify-center items-center' : ''
							)}
						>
							<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
							<div className="mt-2 text-gray-500 flex flex-col items-center">
								<span className="font-medium">阿芬</span>
							</div>
						</div>
					) : (
						<>
							{newCallStore?.room?.members?.map((item: any, index) => (
								<div className="flex flex-col justify-center items-center" key={index}>
									<img className="size-28 rounded-full bg-black bg-opacity-10" src={item?.avatar} />
									<div className="mt-2 text-gray-500 flex flex-col items-center">
										<span className="font-medium">{item?.nickname}</span>
									</div>
								</div>
							))}
						</>
					)}
				</div>
				<div className={clsx('text-gray-400', isGroup ? '' : 'w-full fixed bottom-0')}>
					<div className="p-4 flex flex-col justify-center items-center">
						<span className="font-bold">{newCallStore.statusText(newCallStore.status)}</span>
						<span className="font-bold">{'00:00'}</span>
					</div>
					<div className="pt-4 pb-10 grid grid-cols-5 gap-x-0 gap-y-5">
						<div className="col-span-2 flex justify-center">
							{/* 开启语音 */}
							<div className="flex flex-col justify-center items-center">
								<div className="p-4 rounded-full bg-[#F9BAA7] text-white" onClick={openMike}>
									<Icon f7={audioEnable ? 'mic_fill' : 'mic'} size={30} />
								</div>
							</div>
						</div>
						<div className="flex justify-center">
							{videoEnable && (
								// 切换摄像头
								<div className="flex flex-col justify-center items-center">
									<div className="p-4 rounded-full bg-[#F9BAA7] text-white" onClick={switchCamera}>
										<Icon f7={frontCamera ? 'camera_rotate_fill' : 'camera_rotate'} size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="col-span-2 flex justify-center">
							{/* 开启视频 */}
							<div className="flex flex-col justify-center items-center">
								<div className="p-4 rounded-full bg-[#B9B3DD] text-white" onClick={openCamera}>
									<Icon f7={videoEnable ? 'videocam_fill' : 'videocam'} size={30} />
								</div>
							</div>
						</div>
						<div className="col-span-2 flex justify-center">
							{!isCallActive && (
								// 拒绝
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#F9BAA7] rotate-90"
										onClick={refuseJoinRoom}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="flex justify-center">
							{isCallActive && (
								// 挂断
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full text-white bg-[#F9BAA7] rotate-90"
										onClick={leaveRoom}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="col-span-2 flex justify-center">
							{!isCallActive && (
								// 接听
								<div className="flex flex-col justify-center items-center">
									<div className="p-4 rounded-full text-white bg-[#65C6B0]" onClick={joinRoom}>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</PageContent>
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

export default Call
