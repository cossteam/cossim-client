import { Icon, Link, Popup } from 'framework7-react'
import OperateButton from './OperateButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import './index.scss'
import clsx from 'clsx'
import { ConnectionState, LocalTrack, RemoteTrack, Room, RoomEvent, VideoPresets } from 'livekit-client'
import { useAsyncEffect } from '@reactuses/core'
import VideoBox from './VideoBox'
import { LiveRoomStates, useLiveRoomStore } from '@/stores/liveRoom'
import { SocketEvent } from '@/shared'

const LiveRoomNew: React.FC = () => {
	// 状态
	const liveRoomStore = useLiveRoomStore()
	const isBackend = useMemo(() => {
		return !liveRoomStore.opened && liveRoomStore.state !== LiveRoomStates.IDLE
	}, [liveRoomStore.opened, liveRoomStore.state])
	const isGroup = useMemo(() => {
		return liveRoomStore.isGroup
	}, [liveRoomStore.isGroup])
	const isVideo = useMemo(() => {
		return liveRoomStore.video
	}, [liveRoomStore.video])
	const isWaiting = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.WAITING
	}, [liveRoomStore.state])
	const isJoining = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.JOINING
	}, [liveRoomStore.state])
	const isBusy = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.BUSY
	}, [liveRoomStore.state])
	// 事件处理
	useEffect(() => {
		if (!liveRoomStore?.eventDate?.event) return
		console.log('收到事件', liveRoomStore?.eventDate?.event)
		// 来电
		if ([SocketEvent.UserCallReqEvent, SocketEvent.GroupCallReqEvent].includes(liveRoomStore?.eventDate?.event)) {
			liveRoomStore.handleCall()
			return
		}
		// 拒绝/挂断
		if (
			[
				SocketEvent.UserCallRejectEvent,
				SocketEvent.GroupCallRejectEvent,
				SocketEvent.UserCallHangupEvent,
				SocketEvent.GroupCallHangupEvent
			].includes(liveRoomStore?.eventDate?.event)
		) {
			liveRoomStore.hangup()
			return
		}
	}, [liveRoomStore?.eventDate?.event])
	// 创建房间
	const client = useRef<Room>()
	const [audioEnable, setAudioEnable] = useState(true)
	const [audioTrachs, setAudioTrachs] = useState<LocalTrack[]>([])
	const [videoEnable, setVideoEnable] = useState(true)
	const [videoTrachs, setVideoTrachs] = useState<LocalTrack[]>([])
	const [remoteAudioTracks, setRemoteAudioTracks] = useState<RemoteTrack[]>([])
	const [remoteVideoTracks, setRemoteVideoTracks] = useState<RemoteTrack[]>([])
	const createLocalTracks = async (option: { audio?: boolean; video?: boolean }) => {
		const localTrack = (await client.current?.localParticipant.createTracks(option)) ?? []
		const audioTracks = []
		const videoTracks = []
		for (const track of localTrack) {
			switch (track.kind) {
				case 'audio':
					audioTracks.push(track)
					break
				case 'video':
					videoTracks.push(track)
					break
			}
		}
		setVideoTrachs(videoTracks)
		setAudioTrachs(audioTracks)
	}
	const cleanLocalTracks = (option: { audio?: boolean; video?: boolean }) => {
		if (!client.current) return
		if (option.audio) {
			client.current.localParticipant.setMicrophoneEnabled(option.audio)
			audioTrachs.map((track) => {
				track.stop()
			})
		}
		if (option.video) {
			client.current.localParticipant.setCameraEnabled(option.video)
			videoTrachs.map((track) => {
				track.stop()
			})
		}
	}
	const connectRoom = () => {
		let count = 0
		const connect = () => {
			return new Promise<void>((resolve, reject) => {
				console.log('count', count)
				if (count >= 3) {
					liveRoomStore.updateState(LiveRoomStates.ERROR)
					reject()
					return
				}
				console.log(getliveRoomStatesText(liveRoomStore.state))
				console.log(client.current)
				// liveRoomStore.updateState(LiveRoomStates.JOINING)
				client.current
					?.connect(liveRoomStore.url!, liveRoomStore.token!)
					.then(() => {
						count = 0
						liveRoomStore.updateState(LiveRoomStates.BUSY)
						resolve()
						return
					})
					.catch((error) => {
						count += 1
						console.log(error)
						connect()
					})
			})
		}
		return connect()
	}
	const disconnectRoom = async () => {
		audioTrachs.map((track) => {
			track.stop()
		})
		videoTrachs.map((track) => {
			track.stop()
		})
		client.current?.state === ConnectionState.Connected && (await client.current?.disconnect())
		client.current = undefined
		console.log('销毁房间')
	}
	// 通话状态监听
	useAsyncEffect(
		async () => {
			console.log('当前状态', getliveRoomStatesText(liveRoomStore.state))
			switch (liveRoomStore.state) {
				case LiveRoomStates.IDLE:
					break
				case LiveRoomStates.WAITING:
					console.log('初始化房间')
					client.current = new Room({
						adaptiveStream: true,
						dynacast: true,
						videoCaptureDefaults: {
							// resolution: VideoPresets.h90.resolution
							resolution: VideoPresets.h720.resolution
						}
					})
					console.log(liveRoomStore.url!, liveRoomStore.token!)
					client.current?.prepareConnection(liveRoomStore.url!)
					await createLocalTracks({
						audio: audioEnable,
						video: videoEnable
					})
					break
				case LiveRoomStates.JOINING:
					console.log('连接中')
					await connectRoom()
					break
				case LiveRoomStates.BUSY:
					break
				case LiveRoomStates.REFUSE:
				case LiveRoomStates.HANGUP:
					console.log('拒绝/挂断')
					await disconnectRoom()
					break
				case LiveRoomStates.ERROR:
					console.log('错误')
					liveRoomStore.hangup()
					break
			}
		},
		async () => {},
		[liveRoomStore.state]
	)
	// 房间事件监听
	useAsyncEffect(
		async () => {
			client.current?.on(RoomEvent.Connected, () => {
				console.log('连接成功')
				client.current?.localParticipant.setCameraEnabled(videoEnable)
				client.current?.localParticipant.setMicrophoneEnabled(audioEnable)
			})
			client.current?.on(RoomEvent.Disconnected, () => {
				console.log('连接断开')
			})
			client.current?.on(RoomEvent.TrackSubscribed, (remoteTrack, remotePublication, remoteParticipant) => {
				console.log('订阅成功')
				console.log('订阅成功', remoteTrack)
				console.log('订阅成功', remotePublication)
				console.log('订阅成功', remoteParticipant)
				if (remoteTrack.kind === 'video') {
					setRemoteVideoTracks([...remoteVideoTracks, remoteTrack])
				} else if (remoteTrack.kind === 'audio') {
					setRemoteAudioTracks([...remoteAudioTracks, remoteTrack])
					remoteTrack.attach().play()
				}
			})
		},
		async () => {},
		[client.current]
	)
	// 麦克风
	useEffect(() => {
		if (audioEnable) {
			createLocalTracks({ audio: audioEnable })
		} else {
			cleanLocalTracks({ audio: audioEnable })
		}
	}, [audioEnable])
	// 摄像头
	useEffect(() => {
		if (audioEnable) {
			cleanLocalTracks({ video: videoEnable })
		} else {
			createLocalTracks({ video: videoEnable })
		}
	}, [videoEnable])

	// 界面布局
	const [avctiv, setAvctiv] = useState(-1)
	const videoSize = useMemo(() => {
		const width = document.body.clientWidth
		return width > 0 ? Math.floor(width / 2) : 0
	}, [document.body.clientWidth])
	const [videosTop, setVideosTop] = useState(0)
	const onVideosScroll = (e: any) => {
		setVideosTop(e.target.scrollTop)
	}

	const getliveRoomStatesText = (liveRoomStates: LiveRoomStates) => {
		switch (liveRoomStates) {
			case LiveRoomStates.IDLE:
				return '空闲'
			case LiveRoomStates.WAITING:
				return '等待中'
			case LiveRoomStates.REFUSE:
				return '拒绝'
			case LiveRoomStates.JOINING:
				return '加入中'
			case LiveRoomStates.BUSY:
				return '通话中'
			case LiveRoomStates.HANGUP:
				return '挂断'
			case LiveRoomStates.ERROR:
				return '连接失败'
			default:
				return ''
		}
	}

	return (
		<>
			<Popup
				opened={liveRoomStore.opened}
				tabletFullscreen
				closeByBackdropClick={false}
				className="bg-[rgba(0,0,0,.9)] text-white"
			>
				<div className="h-full flex flex-col justify-center items-center">
					<div
						className={clsx(
							'w-full z-[999] flex justify-between items-center',
							!isGroup ? 'absolute top-0' : ''
						)}
					>
						<div className="flex-1 m-4 flex">
							<Link
								iconF7="arrow_uturn_down_circle_fill"
								color="white"
								onClick={() => liveRoomStore.updateOpened(!liveRoomStore.opened)}
							/>
						</div>
						<div>
							<span>00:00</span>
						</div>
						<div className="flex-1 m-4 flex justify-end"></div>
					</div>
					{!isGroup ? (
						<div id="videos" className="w-full h-full">
							{[...videoTrachs, ...remoteVideoTracks].map((videoTrack, index) => {
								return (
									<VideoBox
										key={index}
										className="flex justify-center items-center overflow-hidden"
										style={{
											width: avctiv === index ? `100px` : `100%`,
											height: avctiv === index ? `150px` : `100%`,
											position: avctiv === index ? 'fixed' : 'relative',
											top: avctiv === index ? `3%` : 'auto',
											right: avctiv === index ? `5%` : 'auto',
											zIndex: avctiv === index ? 999 : 0
										}}
										track={videoTrack}
										onClick={() => {
											setAvctiv(avctiv === index ? -1 : index)
										}}
									>
										{/* {index === 0 && <div className="absolute top-0 right-0">第一</div>} */}
									</VideoBox>
								)
							})}
						</div>
					) : (
						<div
							id="videos"
							className="w-full h-full max-h-fit flex flex-wrap"
							style={{
								overflowY: avctiv === -1 ? 'auto' : 'hidden',
								position: 'relative'
							}}
							onScroll={onVideosScroll}
						>
							{[...videoTrachs, ...remoteVideoTracks].map((videoTrack, index) => {
								return (
									<VideoBox
										key={index}
										className="flex justify-center items-center overflow-hidden"
										style={{
											width: avctiv === index ? `100%` : `${videoSize}px`,
											height: avctiv === index ? `100%` : `${videoSize}px`,
											position: avctiv === index ? 'absolute' : 'relative',
											top: avctiv === index ? `${videosTop}px` : 'auto',
											left: avctiv === index ? 0 : 'auto',
											zIndex: avctiv === index ? 999 : 0
										}}
										track={videoTrack}
										onClick={() => setAvctiv(avctiv === index ? -1 : index)}
									/>
								)
							})}
						</div>
					)}
					<div className={clsx('w-full', !isGroup ? 'absolute bottom-0' : '')}>
						<div className="m-4 flex flex-col justify-evenly  items-center">
							<span>{getliveRoomStatesText(liveRoomStore.state)}</span>
						</div>
						<div className="m-4 flex justify-evenly items-center">
							<OperateButton
								f7Icon={audioEnable ? 'mic_fill' : 'mic'}
								text="麦克风"
								onClick={() => setAudioEnable(!audioEnable)}
							/>
							{(isBusy || isJoining) && (
								<OperateButton
									f7Icon="phone_fill"
									text="挂断"
									iconRotate={134}
									iconColor="#fff"
									backgroundColor="#ff4949"
									onClick={() => liveRoomStore.hangup()}
								/>
							)}
							{isVideo && (
								<OperateButton
									f7Icon={videoEnable ? 'videocam_fill' : 'videocam'}
									text="摄像头"
									onClick={() => setVideoEnable(!videoEnable)}
								/>
							)}
						</div>
						<div className="m-4 flex justify-evenly items-center">
							{isWaiting && (
								<OperateButton
									f7Icon="phone_fill"
									text="拒绝"
									iconRotate={134}
									iconColor="#fff"
									backgroundColor="#ff4949"
									onClick={liveRoomStore.refuse}
								/>
							)}
							{isGroup && isBusy && (
								<OperateButton
									f7Icon="phone_fill"
									text="挂断"
									iconRotate={134}
									iconColor="#fff"
									backgroundColor="#ff4949"
									onClick={() => liveRoomStore.hangup()}
								/>
							)}
							{isWaiting && (
								<OperateButton
									f7Icon="phone_fill"
									text="接通"
									iconColor="#fff"
									backgroundColor="#43d143"
									onClick={liveRoomStore.join}
								/>
							)}
						</div>
					</div>
				</div>
			</Popup>
			{isBackend && (
				<div
					className="show-live z-[9999] bg-[rgba(0,0,0,0.8)] text-white py-3 px-2 rounded-l-lg fixed top-[20%] right-0"
					onClick={() => {}}
				>
					<Icon f7="phone_fill" size={20} />
				</div>
			)}
		</>
	)
}

export default LiveRoomNew
