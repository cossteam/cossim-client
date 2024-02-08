import React, { useEffect } from 'react'
import { Button } from 'framework7-react'
import { PhoneFill } from 'framework7-icons/react'
import { useLiveStore } from '@/stores/live'
import clsx from 'clsx'
import { joinLiveUserApi, leaveLiveUserApi, rejectLiveUserApi } from '@/api/live'
import '@livekit/components-styles'
import './LiveKit.less'
import {
	ControlBar,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { liveStatus as LIVESTATUS, getLiveStatusText } from '@/utils/constants'

export default function LiveKit() {
	const { liveStatus, updateLiveStatus, liveInfo, updateLiveInfo, isBack, updateBack } = useLiveStore()

	useEffect(() => {
		console.log('liveStatus', liveStatus)
		console.log('liveInfo', liveInfo)
	}, [liveStatus])

	// 加入
	const joinLive = async () => {
		const { code, data } = await joinLiveUserApi({})
		if (code === 200) {
			updateLiveInfo({
				...liveInfo,
				...data
			})
			updateLiveStatus(LIVESTATUS.DURING)
		}
	}

	// 拒绝
	const rejectLive = async () => {
		await rejectLiveUserApi()
		updateLiveStatus(LIVESTATUS.REJECTED)
		setTimeout(() => {
			updateLiveStatus(LIVESTATUS.END)
			updateLiveInfo(null)
		}, 1000 * 2)
	}

	// 挂断
	const leaveLive = async () => {
		await leaveLiveUserApi()
		updateLiveStatus(LIVESTATUS.END)
		updateLiveInfo(null)
	}

	// 连接断开
	const onDisconnected = () => {
		// f7.dialog.preloader('网络异常...')
		// setTimeout(() => {
		// 	// f7.dialog.close()
		// 	leaveLive()
		// }, 1000 * 3)
	}

	return (
		<>
			{/*
                前台：
                    等待
                    通话
                    挂断
                后台：
            */}
			{liveStatus !== LIVESTATUS.END && (
				<div
					className={clsx(
						'fixed right-0 z-[9999] bg-black text-white',
						isBack ? ' top-[30%] rounded-l-lg' : ' top-0'
					)}
				>
					{isBack && (
						<div className={clsx('py-4 pl-2')} onClick={() => {}}>
							<PhoneFill className="w-[24px] h-[24px]" onClick={() => updateBack(false)} />
						</div>
					)}
					{liveInfo && (
						<div
							className={clsx(
								'w-screen h-screen overflow-y-auto',
								isBack ? 'absolute top-0 right-[-9999px]' : ''
							)}
						>
							{liveStatus === LIVESTATUS.DURING && (
								<LiveKitRoom
									data-lk-theme="default"
									style={{ height: '100%' }}
									video={false}
									audio={true}
									screen={false}
									token={liveInfo.token}
									serverUrl={liveInfo.url}
									onDisconnected={onDisconnected}
								>
									<MyVideoConference />
									<RoomAudioRenderer />
									<ControlBar />
								</LiveKitRoom>
							)}
							<div className={clsx('px-3 pb-3 bg-[#111]', liveStatus === LIVESTATUS.WAITING && 'h-full')}>
								<div className="mb-3 text-center">
									{/* {liveStatus === LIVESTATUS.WAITING
                                        ? `${getLiveStatusText(liveStatus)}(${waitingTime})...`
                                        : getLiveStatusText(liveStatus)} */}
									{getLiveStatusText(liveStatus)}
								</div>
								<Button className="mb-3 p-5" fill round color="blue" onClick={() => updateBack(true)}>
									返回
								</Button>
								{liveStatus === LIVESTATUS.WAITING && (
									<>
										<Button
											className="mb-3 p-5"
											fill
											round
											color="green"
											onClick={() => joinLive()}
										>
											加入
										</Button>
										<Button
											className="mb-3 p-5"
											fill
											round
											color="red"
											onClick={() => rejectLive()}
										>
											拒绝
										</Button>
									</>
								)}
								{liveStatus === LIVESTATUS.DURING && (
									<Button className="p-5" fill round color="red" onClick={() => leaveLive()}>
										挂断
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</>
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
