import React, { useEffect, useState } from 'react'
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
import { Navbar, Page } from 'framework7-react'
import { useLiveStore } from '@/stores/live'

export default function App() {
	const [init, setInit] = useState(false)
	const { live } = useLiveStore()
	useEffect(() => {
		if (live) {
			const { token, url } = live
			console.log('token', token)
			console.log('serverUrl', url)
			setInit(true)
		}
	}, [])

	return (
		<Page noToolbar>
			<Navbar className="messages-navbar bg-white" backLink></Navbar>
			{init && (
				<LiveKitRoom
					video={true}
					audio={true}
					token={live.token}
					serverUrl={live.url}
					data-lk-theme="default"
					style={{ height: '100%' }}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<ControlBar />
				</LiveKitRoom>
			)}
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
