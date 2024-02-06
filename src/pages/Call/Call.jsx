import React, { useEffect, useState } from 'react'
import '@livekit/components-styles'
import {
	AudioConference,
	ControlBar,
	DisconnectButton,
	GridLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	useTracks
} from '@livekit/components-react'
import { Room, Track } from 'livekit-client'
import { Navbar, Page } from 'framework7-react'
import { useLiveStore } from '@/stores/live'
import { leaveLiveUserApi } from '@/api/live'

export default function App() {
	const [init, setInit] = useState(false)
	const { live, updateLive, updateLiveStatus } = useLiveStore()

	const leaveLive = async () => {
		const { code, msg } = await leaveLiveUserApi({
			room: live.room
		})
		if (code === 200) {
			updateLiveStatus(-1)
			updateLive(null)
		}
		code !== 200 && f7.dialog.alert(msg)
	}

	useEffect(() => {
		if (live) {
			const { token, url } = live
			console.log('token', token)
			console.log('serverUrl', url)
			setInit(true)

			const room = new Room()
			room.connect(url, token).then((res) => {
				console.log(res)
			})
		}
		return () => {
			leaveLive()
		}
	}, [])

	return (
		<Page noToolbar className="bg-[#111]">
			{/* <Navbar className="messages-navbar bg-white" backLink></Navbar> */}
			{init && (
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
