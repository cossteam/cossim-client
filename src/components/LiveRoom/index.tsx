import { Icon, Link, Popup, f7 } from 'framework7-react'
import OperateButton from './OperateButton'
import { useMemo, useRef, useState } from 'react'
import './index.scss'
import clsx from 'clsx'
import { LocalTrack, RemoteTrack, Room, RoomEvent, VideoPresets } from 'livekit-client'
import { useAsyncEffect } from '@reactuses/core'
import VideoBox from './VideoBox'
import { LiveRoomStates, useLiveRoomStore } from '@/stores/liveRoom'
import Timer from './Timer'

const LiveRoomNew: React.FC = () => {
	// 房间状态
	const liveRoomStore = useLiveRoomStore()
	const isBackend = useMemo(() => {
		// return liveRoomStore.opened && [LiveRoomStates].includes(liveRoomStore.state)
		return !liveRoomStore.opened && liveRoomStore.state !== LiveRoomStates.IDLE
	}, [liveRoomStore.opened, liveRoomStore.state])
	const isGroup = useMemo(() => {
		return liveRoomStore.isGroup
	}, [liveRoomStore.isGroup])
	const isVideo = useMemo(() => {
		return liveRoomStore.video
	}, [liveRoomStore.video])
	// 通话状态
	const isWaiting = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.WAITING
	}, [liveRoomStore.state])
	const isJoining = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.JOINING
	}, [liveRoomStore.state])
	const isBusy = useMemo(() => {
		return liveRoomStore.state === LiveRoomStates.BUSY
	}, [liveRoomStore.state])

	// 创建房间
	const client = useRef<Room>()
	// 本地
	const [audioEnable, setAudioEnable] = useState(true)
	const [videoEnable, setVideoEnable] = useState(true)
	// const [audioTrachs, setAudioTrachs] = useState<LocalTrack[]>([])
	const [videoTrachs, setVideoTrachs] = useState<LocalTrack[]>([])
	// 远程
	const [remoteAudioTracks, setRemoteAudioTracks] = useState<RemoteTrack[]>([])
	const [remoteVideoTracks, setRemoteVideoTracks] = useState<RemoteTrack[]>([])

	// 初始化房间
	const initRoom = async () => {
		console.log('初始化房间', client.current)
		// 创建房间
		client.current = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				// resolution: VideoPresets.h90.resolution
				resolution: VideoPresets.h720.resolution
			}
		})
		// 获取本地音视频流
		const localTracks = await client.current.localParticipant.createTracks({
			audio: true,
			video: isVideo
		})
		const audioTracks = []
		const videoTracks = []
		for (const track of localTracks) {
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
		// setAudioTrachs(audioTracks)
		// 监听连接事件
		client.current.on(RoomEvent.Connected, () => {
			console.log('连接成功', client.current)
		})
		// 监听订阅事件
		client.current.on(RoomEvent.TrackSubscribed, (remoteTrack, remotePublication, remoteParticipant) => {
			console.log('订阅成功 START')
			console.log(
				`订阅到【${remoteParticipant.name}】的远程【${remoteTrack.kind === 'audio' ? '音频' : '视频'}】频道`
			)
			console.log({ remoteTrack, remotePublication, remoteParticipant })
			console.log('订阅成功 END')
			if (remoteTrack.kind === 'video') {
				setRemoteVideoTracks([...remoteVideoTracks, remoteTrack])
			} else if (remoteTrack.kind === 'audio') {
				setRemoteAudioTracks([...remoteAudioTracks, remoteTrack])
				remoteTrack.attach().play()
			}
		})
		// 监听断开事件
		client.current.on(RoomEvent.Disconnected, () => {
			console.log('断开连接', client.current)
			// liveRoomStore.hangup()
		})
	}
	const joinRoom = async () => {
		// 连接房间
		if (liveRoomStore.url === null || liveRoomStore.token === null) {
			f7.dialog.alert('房间链接错误', '请检查房间链接和凭证是否正确')
			return
		}
		return await client.current?.connect(liveRoomStore.url, liveRoomStore.token).then(() => {
			console.log('加入房间成功')
			liveRoomStore.updateState(LiveRoomStates.BUSY)
		})
	}

	// 通话状态监听
	useAsyncEffect(
		async () => {
			console.log('当前状态', liveRoomStore.getliveRoomStatesText(liveRoomStore.state))
			console.log('当前房间', client.current)
			switch (liveRoomStore.state) {
				case LiveRoomStates.IDLE:
					break
				case LiveRoomStates.WAITING:
					await initRoom()
					break
				case LiveRoomStates.JOINING:
					await joinRoom()
					break
				case LiveRoomStates.BUSY:
					if (!client.current) {
						await initRoom()
						await joinRoom()
					}
					break
				case LiveRoomStates.REFUSE:
				case LiveRoomStates.HANGUP:
					console.log('拒绝/挂断')
					// await disconnectRoom()
					break
				case LiveRoomStates.REFUSEBYOTHER:
				case LiveRoomStates.HANGUPBYOTHER:
					console.log('被拒绝/被挂断')
					break
				case LiveRoomStates.ERROR:
					console.log('错误')
					// liveRoomStore.hangup()
					break
			}
		},
		async () => {},
		[liveRoomStore.state]
	)

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
							{(isWaiting || isJoining) && (
								<Timer
									timeout={60}
									onTimeout={() => {
										liveRoomStore.updateState(LiveRoomStates.TIMEOUT)
										setTimeout(() => {
											liveRoomStore.resetState()
										}, 2000)
									}}
								/>
							)}
							{isBusy && <Timer />}
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
										videostyle={{
											maxWidth: 'none',
											height: '100%',
											transform: 'scaleX(-1)',
											autoplay: true,
											loop: true,
											muted: true
										}}
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
							className="w-full h-full max-h-fit"
							style={{
								overflowY: avctiv === -1 ? 'auto' : 'hidden',
								position: 'relative'
							}}
							onScroll={onVideosScroll}
						>
							<div id="videos" className="w-full flex flex-wrap" style={{}}>
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
											videostyle={{
												maxWidth: 'none',
												width: '100%',
												transform: 'scaleX(-1)',
												autoplay: true,
												loop: true,
												muted: true
											}}
											onClick={() => setAvctiv(avctiv === index ? -1 : index)}
										/>
									)
								})}
							</div>
						</div>
					)}
					<div className={clsx('w-full', !isGroup ? 'absolute bottom-0' : '')}>
						<div className="m-4 flex flex-col justify-evenly  items-center">
							<span>{liveRoomStore.getliveRoomStatesText(liveRoomStore.state)}</span>
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
							{/* {isGroup && isBusy && (
								<OperateButton
									f7Icon="phone_fill"
									text="挂断"
									iconRotate={134}
									iconColor="#fff"
									backgroundColor="#ff4949"
									onClick={() => liveRoomStore.hangup()}
								/>
							)} */}
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
					onClick={() => liveRoomStore.updateOpened(!liveRoomStore.opened)}
				>
					<Icon f7="phone_fill" size={20} />
				</div>
			)}
		</>
	)
}

export default LiveRoomNew
