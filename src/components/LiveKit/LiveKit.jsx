import React, { useEffect } from 'react'
import { Button } from 'framework7-react'
import { PhoneFill } from 'framework7-icons/react'
import { useLiveStore } from '@/stores/live'
import clsx from 'clsx'
import { leaveLiveUserApi } from '@/api/live'
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

export default function LiveKit() {
	const { liveStatus, updateLiveStatus, live, updateLive, isBack, updateBack } = useLiveStore()

	const leaveLive = async () => {
		await leaveLiveUserApi()
		updateLiveStatus(-1)
		updateLive(null)
	}

	useEffect(() => {}, [])

	return (
		<>
			{[14, 15].includes(liveStatus) && (
				<div className={clsx('fixed right-0 z-[9999] bg-black', isBack ? 'top-[30%]' : 'top-0')}>
					{isBack ? (
						<div className="py-4 pl-2 rounded-l-lg" onClick={() => updateBack(false)}>
							<PhoneFill className="w-[24px] h-[24px] text-white" onClick={() => {}} />
						</div>
					) : (
						live && (
							<div className="w-screen h-screen text-white overflow-y-auto">
								<LiveKitRoom
									video={true}
									audio={true}
									screen={true}
									token={live.token}
									serverUrl={live.url}
									data-lk-theme="default"
									style={{ height: '100%' }}
								>
									<MyVideoConference />
									<RoomAudioRenderer />
									<ControlBar />
								</LiveKitRoom>
								<div>
									<Button onClick={() => updateBack(true)}>返回</Button>
									<Button onClick={leaveLive}>挂断</Button>
								</div>
							</div>
						)
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
