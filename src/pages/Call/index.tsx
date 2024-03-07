import { useNewCallStore } from '@/stores/new_call'
import clsx from 'clsx'
import { Icon, Link, Page, PageContent } from 'framework7-react'
import { useEffect, useState } from 'react'
import { CallStatus } from './enums'
import { Room } from 'livekit-client'
import { useLiveKitRoom } from '@livekit/components-react'

const Call: React.FC<RouterProps> = (props) => {
	useEffect(() => {
		console.log('Call', props)
	}, [])

	const [isCallActive, setCallActive] = useState(false)
	const [isGroup, setIsGroup] = useState(false)
	const [audioEnable, setAudioEnable] = useState(true)
	const [videoEnable, setVideoEnable] = useState(false)
	const [frontCamera, setFrontCamera] = useState(true)
	const imgRul = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
	const [room, setRoom] = useState<Room | null>(null)

	const newCallStore = useNewCallStore()
	useEffect(() => {
		setAudioEnable(newCallStore.room?.option?.audioEnabled ?? false)
		setVideoEnable(newCallStore.room?.option?.videoEnabled ?? false)
		setIsGroup(newCallStore.room?.isGroup ?? false)
		if (newCallStore.status === CallStatus.CALL && newCallStore.room !== null) {
			setCallActive(true)
			try {
				if (!room) {
					const options = {}
					setRoom(new Room(options))
					return
				}
				room.connect(newCallStore.room.url, newCallStore.room.token).then(() => {
					room.localParticipant.setMicrophoneEnabled(newCallStore.room?.option?.audioEnabled ?? false)
					room.localParticipant.setCameraEnabled(newCallStore.room?.option?.videoEnabled ?? false)
				})
				room.localParticipant.setTrackSubscriptionPermissions(false, [
					{
						participantIdentity: 'allowed-identity',
						allowAll: true
					}
				])
			} catch (error) {
				console.dir(error)
			}
		}
	}, [newCallStore.status])

	useEffect(() => {}, [newCallStore.room?.option])

	// const root = useLiveKitRoom()

	return (
		<Page noNavbar noToolbar>
			<PageContent className="h-full relative flex flex-col ">
				<div className={clsx('p-2 flex justify-end', isGroup ? 'w-full' : 'fixed top-0 right-0')}>
					{/* <Button onClick={() => setIsGroup(!isGroup)}>切换群聊模式</Button> */}
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
						isGroup ? 'overflow-y-auto grid grid-cols-2 gap-0' : ' absolute top-1/4 flex justify-center'
					)}
				>
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
					{isGroup && (
						<>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<img className="size-28 rounded-full bg-black bg-opacity-10" src={imgRul} alt="" />
								<div className="mt-2 text-gray-500 flex flex-col items-center">
									<span className="font-medium">阿芬</span>
								</div>
							</div>
						</>
					)}
				</div>
				{/* bg-[rgba(0,0,0,0.75)] text-white */}
				<div className={clsx('text-gray-400', isGroup ? '' : 'w-full fixed bottom-0')}>
					<div className="p-4 flex flex-col justify-center items-center">
						<span className="font-bold">{newCallStore.statusText(newCallStore.status)}</span>
						<span className="font-bold">{'00:00'}</span>
					</div>
					<div className="pt-4 pb-10 grid grid-cols-5 gap-x-0 gap-y-5">
						<div className="col-span-2 flex justify-center">
							{/* 开启语音 */}
							<div className="flex flex-col justify-center items-center">
								<div
									className="p-4 rounded-full bg-[#F9BAA7] text-white"
									onClick={() => setAudioEnable(!audioEnable)}
								>
									<Icon f7={audioEnable ? 'mic_fill' : 'mic'} size={30} />
								</div>
							</div>
						</div>
						<div className="flex justify-center">
							{videoEnable && (
								// 切换摄像头
								<div className="flex flex-col justify-center items-center">
									<div
										className="p-4 rounded-full bg-[#F9BAA7] text-white"
										onClick={() => setFrontCamera(!frontCamera)}
									>
										<Icon f7={frontCamera ? 'camera_rotate_fill' : 'camera_rotate'} size={30} />
									</div>
								</div>
							)}
						</div>
						<div className="col-span-2 flex justify-center">
							{/* 开启视频 */}
							<div className="flex flex-col justify-center items-center">
								<div
									className="p-4 rounded-full bg-[#B9B3DD] text-white"
									onClick={() => setVideoEnable(!videoEnable)}
								>
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
										onClick={() =>
											newCallStore.room !== null &&
											newCallStore.refuseJoinRoom(newCallStore.room?.id)
										}
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
										onClick={() =>
											newCallStore.room !== null && newCallStore.leaveRoom(newCallStore.room?.id)
										}
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
									<div
										className="p-4 rounded-full text-white bg-[#65C6B0]"
										onClick={() =>
											newCallStore.room !== null &&
											newCallStore.joinRoom(newCallStore.room?.id, {
												audioEnabled: true
											})
										}
									>
										<Icon f7="phone_fill" size={30} />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				{/* {[CallStatus.REFUSE, CallStatus.HANGUP].includes(newCallStore.status) && ()} */}
			</PageContent>
		</Page>
	)
}

export default Call
